package com.example.coffee.service;

import com.example.coffee.dto.MemberRequest;
import com.example.coffee.dto.MemberResponse;
import com.example.coffee.entity.Member;
import com.example.coffee.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    @Transactional
    public MemberResponse createMember(MemberRequest request) {
        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }

        Member member = Member.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .name(request.getName())
                .phone(request.getPhone())
                .address(request.getAddress())
                .build();

        memberRepository.save(member);
        return toResponse(member);
    }

    @Transactional(readOnly = true)
    public List<MemberResponse> getAllMembers() {
        return memberRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MemberResponse getMember(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));
        return toResponse(member);
    }

    @Transactional
    public MemberResponse updateMember(Long id, MemberRequest request) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));

        if (!member.getEmail().equals(request.getEmail())
                && memberRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }

        member.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            member.setPassword(request.getPassword());
        }
        member.setName(request.getName());
        member.setPhone(request.getPhone());
        member.setAddress(request.getAddress());

        return toResponse(member);
    }

    @Transactional
    public void deleteMember(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));
        memberRepository.delete(member);
    }

    private MemberResponse toResponse(Member member) {
        return MemberResponse.builder()
                .memberId(member.getMemberId())
                .email(member.getEmail())
                .name(member.getName())
                .phone(member.getPhone())
                .address(member.getAddress())
                .createdAt(member.getCreatedAt())
                .updatedAt(member.getUpdatedAt())
                .build();
    }
}
