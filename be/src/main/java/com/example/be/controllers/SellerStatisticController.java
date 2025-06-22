//package com.example.be.controllers;
//
//import com.example.be.dto.admin.RevenueByCategoryDto;
//import com.example.be.dto.admin.RevenueByPeriodDto;
//import com.example.be.services.SecurityService;
//import com.example.be.services.StatisticsService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.format.annotation.DateTimeFormat;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.time.LocalDate;
//import java.util.List;
//
//@RestController
//@RequestMapping("/seller/statistics")
//@RequiredArgsConstructor
//public class SellerStatisticController {
//    private final StatisticsService statisticsService;
//    private final SecurityService securityService;
//
//    @GetMapping("/revenue/period")
//    public List<RevenueByPeriodDto> getRevenueByPeriod(
//            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
//            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
//            @RequestParam(defaultValue = "DAILY") StatisticsService.GroupBy groupBy
//    ) {
//        return statisticsService.getRevenueByPeriod(start, end, groupBy, securityService.getUserFromRequest().getId());
//    }
//
//    @GetMapping("/revenue/category")
//    public List<RevenueByCategoryDto> getRevenueByCategory(
//            @RequestParam int year,
//            @RequestParam int month
//    ) {
//        LocalDate start = LocalDate.of(year, month, 1);
//        LocalDate end = start.withDayOfMonth(start.lengthOfMonth()).plusDays(1);
//        return statisticsService.getRevenueByCategory(start, end, securityService.getUserFromRequest().getId());
//    }
//}
