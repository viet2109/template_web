package com.example.be.services;


import com.example.be.dao.UserDao;
import com.example.be.entities.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserDao userDao;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userDao.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException(username));
        return CustomUserDetails.builder()
                .id(user.getId())
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(user.getRoles().stream().map(role -> new SimpleGrantedAuthority("ROLE_"+role.name())).toList())
                .build();
    }

    @Data
    @Builder
    @AllArgsConstructor
    public static class CustomUserDetails implements UserDetails {
        private final Long id;
        private final String username;
        private final String password;
        private final Collection<? extends GrantedAuthority> authorities;

        @Override
        public boolean isAccountNonExpired() {
            return true;
        }

        @Override
        public boolean isAccountNonLocked() {
            return true;
        }

        @Override
        public boolean isCredentialsNonExpired() {
            return true;
        }

        @Override
        public boolean isEnabled() {
            return true;
        }
    }
}

