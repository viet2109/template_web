//package com.example.be.controllers;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequiredArgsConstructor
//@RequestMapping("/users")
//public class UserController {
//
////    private final UserService userService;
////
////    @GetMapping("/{id}")
////    public ResponseEntity<UserProfileDto> getUserById(
////            @PathVariable Long id
////    ) {
////        return ResponseEntity.ok(userService.getUserInfo(id));
////    }
////
////    @DeleteMapping("/{id}")
////    public ResponseEntity<Void> deleteUserById(
////            @PathVariable Long id
////    ) {
////        userService.deleteUser(id);
////        return ResponseEntity.noContent().build();
////    }
////
////    @GetMapping
////    public ResponseEntity<Page<UserProfileDto>> searchUsers(
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
////        return ResponseEntity.ok(userService.searchUsers(emailContain, nameContain, role, createdFrom, createdTo, pageable));
////    }
//}
