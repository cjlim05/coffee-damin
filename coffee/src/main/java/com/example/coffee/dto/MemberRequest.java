package com.example.coffee.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberRequest {
    private String email;
    private String password;
    private String name;
    private String phone;
    private String address;
}
