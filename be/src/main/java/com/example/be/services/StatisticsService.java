package com.example.be.services;

import com.example.be.dao.OrderDao;
import com.example.be.dto.admin.RevenueByCategoryDto;
import com.example.be.dto.admin.RevenueByPeriodDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatisticsService {
    private final OrderDao orderDao;

    public enum GroupBy {
        DAILY,
        WEEKLY,
        MONTHLY,
        YEARLY
    }

    public List<RevenueByPeriodDto> getRevenueByPeriod(LocalDate start, LocalDate end, GroupBy groupBy, Long sellerId) {
        String pattern = switch (groupBy) {
            case DAILY -> "%Y-%m-%d";
            case WEEKLY -> "%Y-%u";
            case MONTHLY -> "%Y-%m";
            case YEARLY -> "%Y";
        };
        return orderDao.findRevenueByPeriod(start.atStartOfDay(), end.plusDays(1).atStartOfDay(), pattern, sellerId);
    }

    public List<RevenueByCategoryDto> getRevenueByCategory(LocalDate start, LocalDate end, Long sellerId) {
        return orderDao.findRevenueByCategory(start.atStartOfDay(), end.atStartOfDay(), sellerId);
    }
}
