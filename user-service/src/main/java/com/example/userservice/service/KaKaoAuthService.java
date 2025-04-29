package com.example.userservice.service;

import com.example.userservice.auth.JwtTokenService;
import com.example.userservice.dto.KakaoUserInfoDto;
import com.example.userservice.entity.User;
import com.example.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;


@Service
public class KaKaoAuthService {
      private final RestTemplate restTemplate;

      private final UserRepository userRepository;

      private final JwtTokenService jwtTokenService;

      @Value("${kakao.client-id}")
      private String clientId;

      @Value("${kakao.redirect-uri}")
      private String redirectUri;

      @Autowired
      public KaKaoAuthService(RestTemplate restTemplate1 , UserRepository userRepository , JwtTokenService jwtTokenService) {
            this.restTemplate =restTemplate1;
            this.userRepository =userRepository;
            this.jwtTokenService = jwtTokenService;
      }

      // 1. 인가 코드로 엑세스 토큰 요청
      public String getKakaoAccessToken(String code) {
            String tokenUrl = "https://kauth.kakao.com/oauth/token";

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type","authorization_code");
            params.add("client_id", clientId);
            params.add("redirect_uri",redirectUri);
            params.add("code",code);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            HttpEntity<MultiValueMap<String,String>> request =new HttpEntity<>(params, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request,Map.class);

            Map<String, Object> responseBody = response.getBody();
            return responseBody.get("access_token").toString();
      }

      public KakaoUserInfoDto getKakaoUserInfo(String accessToken){
            String userInfoUrl = "https://kapi.kakao.com/v2/user/me";

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken); //Bearer 로 토큰 인증.
            HttpEntity<String> request = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(userInfoUrl, HttpMethod.GET, request,Map.class);
            Map<String, Object> responseBody = response.getBody();

            System.out.println("카카오 API 응답:" + response.getBody());

            // 카카오 사용자 정보 파싱
            Long kakaoId = Long.valueOf(responseBody.get("id").toString()); //카카오 고유 id

            Map<String ,Object> kakaoAccount = (Map<String , Object>) responseBody.get("kakao_account");
            String email = "no-email"; //기본값 설정

            //후 null 값 검증 로직
            if(kakaoAccount != null){
                  if(kakaoAccount.get("email") != null){
                        email = kakaoAccount.get("email").toString();
                  }
            }

            System.out.println("가져온 이메일:" + email);


            String nickname = "카카오 사용자";
            String profileImage = null;

            if (kakaoAccount != null && kakaoAccount.get("profile") != null) {
                  Map<String ,Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

                  if(profile.get("nickname") != null) {
                        nickname = profile.get("nickname").toString();
                  }
                  if(profile.get("profile_image_url") != null) {
                        profileImage = profile.get("profile_image_url").toString();
                  }
            }

            KakaoUserInfoDto.KakaoProfile kakaoProfile = new KakaoUserInfoDto.KakaoProfile();
            kakaoProfile.setNickname(nickname);
            kakaoProfile.setProfileImage(profileImage);

            KakaoUserInfoDto.KakaoAccount kakaoAccount1 = new KakaoUserInfoDto.KakaoAccount();
            kakaoAccount1.setEmail(email);
            kakaoAccount1.setProfile(kakaoProfile);

            KakaoUserInfoDto kakaoUserInfoDto = new KakaoUserInfoDto();
            kakaoUserInfoDto.setKakaoId(kakaoId);
            kakaoUserInfoDto.setKakaoAccount(kakaoAccount1);

            return kakaoUserInfoDto; //카카오 로그인 유저 인증 정보를 담은 dto 반환.
      }

      //우리 시스템에서 해당 유저를 확인하고 로그인처
      public String loginOrResister(KakaoUserInfoDto kakaoUserInfoDto) {
            Optional<User> existUser = userRepository.findByEmail(kakaoUserInfoDto.getKakaoAccount().getEmail()); //kakao 클래스의 이메일 가져오기;

            User user;

            if(existUser.isPresent()){
                  //기존 회원이면 로그인 처리
                  user =existUser.get();
                  System.out.println("기존 회원 로그인:" + user.getEmail());
            } else {
                  //신규 회원이면 회원가입 처리
                  user = new User();
                  user.setEmail(kakaoUserInfoDto.getKakaoAccount().getEmail());
                  user.setFirstName(kakaoUserInfoDto.getKakaoAccount().getProfile().getNickname());
                  user.setLastName("카카오 유저"); //널값 방지 기본값 절정
                  user.setProfileImage(kakaoUserInfoDto.getKakaoAccount().getProfile().getProfileImage());
                  user.setPhoneNumber("카카오 전화번호");
                  user.setSex("none");
                  user.setRole("ROLE_USER");

                  user.setPassword(UUID.randomUUID().toString()); //안전한 기본 비밀번호 설정.

                  userRepository.save(user);
                  System.out.println("신규 회원 가입 완료:" + user.getEmail());

            }
            String accessToken = jwtTokenService.createAccessToken(user.getEmail());
            String refreshToken = jwtTokenService.createRefreshToken(user.getEmail());

            return accessToken;
      }
}
