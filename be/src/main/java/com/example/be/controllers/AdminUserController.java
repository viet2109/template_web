//package com.example.be.controllers;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequiredArgsConstructor
//@RequestMapping("/admin/users")
//public class AdminUserController {
//
////    private final UserService userService;
////
////    @GetMapping
////    public ResponseEntity<Page<AdminUserDto>> searchUsers(
////            @RequestParam(required = false) String emailContain,
////            @RequestParam(required = false) String nameContain,
////            @RequestParam(required = false) Role role,
////            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdFrom,
////            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdTo,
////            @RequestParam(defaultValue = "createdAt,desc") String[] sort,
////            @RequestParam(defaultValue = "0") int page,
////            @RequestParam(defaultValue = "10") int size
////    ) {
////        Pageable pageable = PageRequest.of(page, size, Utils.parseSort(sort));
////        return ResponseEntity.ok(userService.searchUsersByAdmin(emailContain, nameContain, role, createdFrom, createdTo, pageable));
////    }
//}
