package com.example.be.configs;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "vnpay")
@Getter
@Setter
public class VNPAYConfig {
    private String url;
    private String tmnCode;
    private String hashSecret;
    private String returnUrl;
}
