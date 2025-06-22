package com.example.be.services;

import com.example.be.configs.VNPAYConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class VNPAYService {
    private static final String HMAC_SHA512 = "HmacSHA512";
    private static final SimpleDateFormat TIMESTAMP_FORMATTER = new SimpleDateFormat("yyyyMMddHHmmss");
    private final VNPAYConfig config;

    public String createPaymentUrl(String orderId, BigDecimal amount, String ipAddress) {
        Map<String, String> params = new TreeMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", config.getTmnCode());
        params.put("vnp_TxnRef", orderId);
        params.put("vnp_Amount", amount.multiply(BigDecimal.valueOf(100)).toBigInteger().toString());
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_OrderInfo", "Thanh toán hóa đơn " + orderId);
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", config.getReturnUrl());
        params.put("vnp_IpAddr", ipAddress);

        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        String createDate = TIMESTAMP_FORMATTER.format(calendar.getTime());
        params.put("vnp_CreateDate", createDate);
        calendar.add(Calendar.MINUTE, 15);
        String expireDate = TIMESTAMP_FORMATTER.format(calendar.getTime());
        params.put("vnp_ExpireDate", expireDate);

        StringBuilder hashData = new StringBuilder();
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromUriString(config.getUrl());

        Iterator<Map.Entry<String, String>> it = params.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry<String, String> entry = it.next();
            String key = entry.getKey();
            String value = entry.getValue();
            if (value != null && !value.isEmpty()) {
                String encodedValue = urlEncode(value);
                hashData.append(key).append('=').append(encodedValue);
                uriBuilder.queryParam(key, encodedValue);
                if (it.hasNext()) {
                    hashData.append('&');
                }
            }
        }

        String secureHash = hmacSHA512(config.getHashSecret(), hashData.toString());
        uriBuilder.queryParam("vnp_SecureHash", secureHash);

        return uriBuilder.build(true).toUriString();
    }

    public boolean validateSignature(Map<String, String> fields) {
        String receivedHash = fields.remove("vnp_SecureHash");
        Map<String, String> sorted = new TreeMap<>(fields);
        StringBuilder sb = new StringBuilder();
        Iterator<Map.Entry<String, String>> it = sorted.entrySet().iterator();

        while (it.hasNext()) {
            Map.Entry<String, String> entry = it.next();
            String value = entry.getValue();
            if (value != null && !value.isEmpty()) {
                sb.append(entry.getKey())
                        .append('=')
                        .append(urlEncode(value));
                if (it.hasNext()) sb.append('&');
            }
        }

        String calculatedHash = hmacSHA512(config.getHashSecret(), sb.toString());
        return calculatedHash.equalsIgnoreCase(receivedHash);
    }

    private String hmacSHA512(String key, String data) {
        try {
            Mac mac = Mac.getInstance(HMAC_SHA512);
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), HMAC_SHA512);
            mac.init(secretKey);
            byte[] hashBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(hashBytes.length * 2);
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new IllegalStateException("Failed to calculate HMAC SHA512", e);
        }
    }

    private String urlEncode(String input) {
        return URLEncoder.encode(input, StandardCharsets.US_ASCII);
    }
}