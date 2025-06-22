package com.example.be.listeners;

import com.example.be.services.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FilePreRemoveEventListener {

    private final FileService fileService;

    @EventListener
    public void handleFilePreRemoveEvent(Long fileId) {
        fileService.delete(fileId);
    }
}

