package com.example.be.dto.admin;

import com.example.be.enums.TemplateStatus;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ApproveTemplateDto {

    @NotNull(message = "Template status is required")
    private TemplateStatus status;
    private String rejectionReason;

    @AssertTrue(message = "Invalid status")
    private boolean validate() {
        return status != null && (status == TemplateStatus.APPROVED || status == TemplateStatus.REJECTED);
    }
}
