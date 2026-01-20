package com.example.coffee.controller;

import com.example.coffee.dto.MemberRequest;
import com.example.coffee.dto.MemberResponse;
import com.example.coffee.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping
    public MemberResponse createMember(@RequestBody MemberRequest request) {
        return memberService.createMember(request);
    }

    @GetMapping
    public List<MemberResponse> getMembers() {
        return memberService.getAllMembers();
    }

    @GetMapping("/{id}")
    public MemberResponse getMember(@PathVariable Long id) {
        return memberService.getMember(id);
    }

    @PutMapping("/{id}")
    public MemberResponse updateMember(@PathVariable Long id, @RequestBody MemberRequest request) {
        return memberService.updateMember(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id);
    }
}
