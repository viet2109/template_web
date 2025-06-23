package com.example.be.services;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Slf4j
@Service
public class GoogleAuthService {

    @Value("${app.google.client-id}")
    private String CLIENT_ID;

    public GoogleIdToken.Payload verify(String idTokenString) throws Exception {
        var transport = GoogleNetHttpTransport.newTrustedTransport();
        var verifier = new GoogleIdTokenVerifier.Builder(transport, GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(CLIENT_ID))
                .build();
        log.info("Google ID Token: {}", idTokenString);
        GoogleIdToken idToken = verifier.verify(idTokenString);
        if (idToken == null) {
            throw new IllegalArgumentException("Invalid ID token.");
        }
        log.info(idToken.toString());
        return idToken.getPayload();
    }
}