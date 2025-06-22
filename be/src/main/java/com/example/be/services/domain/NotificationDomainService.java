package com.example.be.services.domain;

import com.example.be.dao.OrderDao;
import com.example.be.dao.PayoutDao;
import com.example.be.dao.TemplateDao;
import com.example.be.dao.UserDao;
import com.example.be.dto.common.EmailNotificationDto;
import com.example.be.entities.*;
import com.example.be.enums.*;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class NotificationDomainService {

    private final JavaMailSender mailSender;
    private final UserDao userRepository;
    private final OrderDao orderRepository;
    private final TemplateDao templateRepository;
    private final PayoutDao payoutRepository;

    /**
     * Gửi email notification
     */
    public void sendEmailNotification(EmailNotificationDto emailDto) {
        try {
            if (emailDto.isHtml()) {
                sendHtmlEmail(emailDto);
            } else {
                sendSimpleEmail(emailDto);
            }
            log.info("Email sent successfully to: {}", emailDto.getTo());
        } catch (Exception e) {
            log.error("Failed to send email to: {}", emailDto.getTo(), e);
            throw new RuntimeException("Failed to send email notification", e);
        }
    }

    /**
     * Gửi thông báo hệ thống cho user
     */
    public void sendSystemNotification(Long userId, String message) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

            // Log system notification (có thể lưu vào database nếu cần)
            log.info("System notification for user {}: {}", user.getEmail(), message);

            // Có thể mở rộng để lưu vào bảng notifications trong database
            // hoặc gửi qua WebSocket cho real-time notification

        } catch (Exception e) {
            log.error("Failed to send system notification to user: {}", userId, e);
            throw new RuntimeException("Failed to send system notification", e);
        }
    }

    /**
     * Thông báo thay đổi trạng thái đơn hàng
     */
    public void notifyOrderStatusChange(Long orderId) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

            User user = order.getUser();
            String subject = "Cập nhật trạng thái đơn hàng #" + orderId;
            String message = buildOrderStatusMessage(order);

            EmailNotificationDto emailDto = EmailNotificationDto.builder()
                    .to(user.getEmail())
                    .subject(subject)
                    .body(message)
                    .html(true)
                    .build();

            sendEmailNotification(emailDto);

            // Gửi system notification
            sendSystemNotification(user.getId(),
                    "Đơn hàng #" + orderId + " đã được cập nhật trạng thái: " + order.getStatus().name());

            log.info("Order status notification sent for order: {}", orderId);
        } catch (Exception e) {
            log.error("Failed to send order status notification for order: {}", orderId, e);
        }
    }

    /**
     * Thông báo duyệt template
     */
    public void notifyTemplateApproval(Long templateId) {
        try {
            Template template = templateRepository.findById(templateId)
                    .orElseThrow(() -> new RuntimeException("Template not found with id: " + templateId));

            SellerProfile seller = template.getSeller();
            User sellerUser = seller.getUser();

            String subject = "Kết quả xét duyệt template: " + template.getName();
            String message = buildTemplateApprovalMessage(template);

            EmailNotificationDto emailDto = EmailNotificationDto.builder()
                    .to(sellerUser.getEmail())
                    .subject(subject)
                    .body(message)
                    .html(true)
                    .build();

            sendEmailNotification(emailDto);

            // Gửi system notification
            String systemMessage = template.getStatus() == TemplateStatus.APPROVED
                    ? "Template '" + template.getName() + "' đã được duyệt thành công!"
                    : "Template '" + template.getName() + "' đã bị từ chối. Lý do: " + template.getRejectionReason();

            sendSystemNotification(sellerUser.getId(), systemMessage);

            log.info("Template approval notification sent for template: {}", templateId);
        } catch (Exception e) {
            log.error("Failed to send template approval notification for template: {}", templateId, e);
        }
    }

    /**
     * Thông báo xử lý payout
     */
    public void notifyPayoutProcessed(Long payoutId) {
        try {
            Payout payout = payoutRepository.findById(payoutId)
                    .orElseThrow(() -> new RuntimeException("Payout not found with id: " + payoutId));

            SellerProfile seller = payout.getSeller();
            User sellerUser = seller.getUser();

            String subject = "Cập nhật thanh toán #" + payoutId;
            String message = buildPayoutProcessedMessage(payout);

            EmailNotificationDto emailDto = EmailNotificationDto.builder()
                    .to(sellerUser.getEmail())
                    .subject(subject)
                    .body(message)
                    .html(true)
                    .build();

            sendEmailNotification(emailDto);

            // Gửi system notification
            String systemMessage = payout.getStatus() == PayoutStatus.COMPLETED
                    ? "Thanh toán #" + payoutId + " đã được xử lý thành công với số tiền " +
                    String.format("%,.0f", payout.getAmount()) + " " + payout.getCurrency()
                    : "Thanh toán #" + payoutId + " đã bị từ chối";

            sendSystemNotification(sellerUser.getId(), systemMessage);

            log.info("Payout processed notification sent for payout: {}", payoutId);
        } catch (Exception e) {
            log.error("Failed to send payout processed notification for payout: {}", payoutId, e);
        }
    }

    private void sendSimpleEmail(EmailNotificationDto emailDto) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(emailDto.getTo());
        message.setSubject(emailDto.getSubject());
        message.setText(emailDto.getBody());
        if (emailDto.getFrom() != null) {
            message.setFrom(emailDto.getFrom());
        }
        mailSender.send(message);
    }

    private void sendHtmlEmail(EmailNotificationDto emailDto) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(emailDto.getTo());
        helper.setSubject(emailDto.getSubject());
        helper.setText(emailDto.getBody(), true);

        if (emailDto.getFrom() != null) {
            helper.setFrom(emailDto.getFrom());
        }

        mailSender.send(message);
    }

    private String buildOrderStatusMessage(Order order) {
        StringBuilder message = new StringBuilder();
        message.append("<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>");
        message.append("<h2 style='color: #333;'>Cập nhật đơn hàng #").append(order.getId()).append("</h2>");
        message.append("<p>Xin chào ").append(getFullName(order.getUser())).append(",</p>");
        message.append("<p>Đơn hàng của bạn đã được cập nhật với thông tin sau:</p>");
        message.append("<div style='background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;'>");
        message.append("<p><strong>Mã đơn hàng:</strong> #").append(order.getId()).append("</p>");
        message.append("<p><strong>Trạng thái đơn hàng:</strong> ").append(getOrderStatusText(order.getStatus())).append("</p>");
        message.append("<p><strong>Trạng thái thanh toán:</strong> ").append(getPaymentStatusText(order.getPaymentStatus())).append("</p>");

        if (order.getCompletedAt() != null) {
            message.append("<p><strong>Hoàn thành lúc:</strong> ")
                    .append(order.getCompletedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")))
                    .append("</p>");
        }

        message.append("</div>");

        if (order.getStatus() == OrderStatus.COMPLETED) {
            message.append("<p style='color: #28a745;'><strong>Cảm ơn bạn đã mua hàng! Bạn có thể tải xuống các template đã mua từ tài khoản của mình.</strong></p>");
        }

        message.append("<p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.</p>");
        message.append("<p>Trân trọng,<br>Đội ngũ hỗ trợ</p>");
        message.append("</div>");

        return message.toString();
    }

    private String buildTemplateApprovalMessage(Template template) {
        StringBuilder message = new StringBuilder();
        message.append("<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>");

        if (template.getStatus() == TemplateStatus.APPROVED) {
            message.append("<h2 style='color: #28a745;'>Template đã được duyệt thành công!</h2>");
            message.append("<p>Xin chào ").append(template.getSeller().getName()).append(",</p>");
            message.append("<p>Chúc mừng! Template của bạn đã được phê duyệt và hiện đã có sẵn trên nền tảng.</p>");
        } else {
            message.append("<h2 style='color: #dc3545;'>Template đã bị từ chối</h2>");
            message.append("<p>Xin chào ").append(template.getSeller().getName()).append(",</p>");
            message.append("<p>Rất tiếc, template của bạn đã bị từ chối.</p>");
        }

        message.append("<div style='background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;'>");
        message.append("<p><strong>Tên template:</strong> ").append(template.getName()).append("</p>");
        message.append("<p><strong>Danh mục:</strong> ").append(getCategoryText(template.getCategory())).append("</p>");
        message.append("<p><strong>Trạng thái:</strong> ").append(getTemplateStatusText(template.getStatus())).append("</p>");

        if (template.getApprovedAt() != null) {
            message.append("<p><strong>Ngày duyệt:</strong> ")
                    .append(template.getApprovedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")))
                    .append("</p>");
        }

        if (template.getRejectionReason() != null && !template.getRejectionReason().isEmpty()) {
            message.append("<p><strong>Lý do từ chối:</strong> ").append(template.getRejectionReason()).append("</p>");
        }

        message.append("</div>");

        if (template.getStatus() == TemplateStatus.APPROVED) {
            message.append("<p>Template của bạn hiện đã được công khai và khách hàng có thể mua. Bạn có thể theo dõi doanh số bán hàng từ dashboard của mình.</p>");
        } else {
            message.append("<p>Bạn có thể chỉnh sửa template theo góp ý và gửi lại để được xem xét.</p>");
        }

        message.append("<p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.</p>");
        message.append("<p>Trân trọng,<br>Đội ngũ quản lý</p>");
        message.append("</div>");

        return message.toString();
    }

    private String buildPayoutProcessedMessage(Payout payout) {
        StringBuilder message = new StringBuilder();
        message.append("<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>");

        if (payout.getStatus() == PayoutStatus.COMPLETED) {
            message.append("<h2 style='color: #28a745;'>Thanh toán đã được xử lý thành công!</h2>");
            message.append("<p>Xin chào ").append(payout.getSeller().getName()).append(",</p>");
            message.append("<p>Yêu cầu thanh toán của bạn đã được xử lý thành công.</p>");
        } else {
            message.append("<h2 style='color: #dc3545;'>Yêu cầu thanh toán đã bị từ chối</h2>");
            message.append("<p>Xin chào ").append(payout.getSeller().getName()).append(",</p>");
            message.append("<p>Rất tiếc, yêu cầu thanh toán của bạn đã bị từ chối.</p>");
        }

        message.append("<div style='background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;'>");
        message.append("<p><strong>Mã thanh toán:</strong> #").append(payout.getId()).append("</p>");
        message.append("<p><strong>Số tiền:</strong> ").append(String.format("%,.0f", payout.getAmount()))
                .append(" ").append(payout.getCurrency()).append("</p>");
        message.append("<p><strong>Phương thức:</strong> ").append(payout.getPaymentMethod()).append("</p>");
        message.append("<p><strong>Trạng thái:</strong> ").append(getPayoutStatusText(payout.getStatus())).append("</p>");

        if (payout.getTransactionId() != null) {
            message.append("<p><strong>Mã giao dịch:</strong> ").append(payout.getTransactionId()).append("</p>");
        }

        if (payout.getProcessedAt() != null) {
            message.append("<p><strong>Thời gian xử lý:</strong> ")
                    .append(payout.getProcessedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")))
                    .append("</p>");
        }

        if (payout.getNotes() != null && !payout.getNotes().isEmpty()) {
            message.append("<p><strong>Ghi chú:</strong> ").append(payout.getNotes()).append("</p>");
        }

        message.append("</div>");

        if (payout.getStatus() == PayoutStatus.COMPLETED) {
            message.append("<p style='color: #28a745;'><strong>Tiền đã được chuyển vào tài khoản của bạn. Vui lòng kiểm tra.</strong></p>");
        } else {
            message.append("<p>Bạn có thể tạo yêu cầu thanh toán mới sau khi khắc phục các vấn đề đã nêu.</p>");
        }

        message.append("<p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.</p>");
        message.append("<p>Trân trọng,<br>Đội ngũ tài chính</p>");
        message.append("</div>");

        return message.toString();
    }

    private String getFullName(User user) {
        String fullName = "";
        if (user.getFirstName() != null) {
            fullName += user.getFirstName();
        }
        if (user.getLastName() != null) {
            if (!fullName.isEmpty()) {
                fullName += " ";
            }
            fullName += user.getLastName();
        }
        return fullName.isEmpty() ? user.getEmail() : fullName;
    }

    private String getOrderStatusText(OrderStatus status) {
        return switch (status) {
            case PENDING -> "Đang xử lý";
            case PROCESSING -> "Đang xử lý thanh toán";
            case COMPLETED -> "Hoàn thành";
            case CANCELLED -> "Đã hủy";
            case REFUNDED -> "Đã hoàn tiền";
        };
    }

    private String getPaymentStatusText(PaymentStatus status) {
        return switch (status) {
            case PENDING -> "Chờ thanh toán";
            case PAID -> "Đã thanh toán";
            case FAILED -> "Thanh toán thất bại";
            case REFUNDED -> "Đã hoàn tiền";
        };
    }

    private String getTemplateStatusText(TemplateStatus status) {
        return switch (status) {
            case PENDING -> "Chờ duyệt";
            case APPROVED -> "Đã duyệt";
            case REJECTED -> "Bị từ chối";
            case SUSPENDED -> "Tạm khóa";
        };
    }

    private String getCategoryText(Category category) {
        // Customize based on your Category enum values
        return category.name();
    }

    private String getPayoutStatusText(PayoutStatus status) {
        return switch (status) {
            case PENDING -> "Chờ xử lý";
            case PROCESSING -> "Đang xử lý";
            case COMPLETED -> "Đã hoàn thành";
            case FAILED -> "Thất bại";
            case CANCELLED -> "Đã hủy";
        };
    }
}