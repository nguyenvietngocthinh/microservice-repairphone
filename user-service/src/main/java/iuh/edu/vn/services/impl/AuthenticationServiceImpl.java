package iuh.edu.vn.services.impl;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import iuh.edu.vn.models.User;
import iuh.edu.vn.models.dtos.request.AuthenticationRequest;
import iuh.edu.vn.models.dtos.request.IntrospectRequest;
import iuh.edu.vn.models.dtos.response.AuthenticationResponse;
import iuh.edu.vn.models.dtos.response.IntrospectResponse;
import iuh.edu.vn.repository.UserRepository;
import iuh.edu.vn.services.AuthenticationService;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    @Autowired
    private UserRepository userRepository;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest) {
        var user = userRepository.findUserByUsername(authenticationRequest.getUsername());
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean isAuthenticated = passwordEncoder.matches(authenticationRequest.getPassword(), user.get().getPassword());

        if(!isAuthenticated)
            throw new RuntimeException("Invalid username or password");

        var token = generateToken(user.get());

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(isAuthenticated)
                .build();
    }

    @Override
    public IntrospectResponse introspect(IntrospectRequest introspectRequest) throws JOSEException, ParseException {
        var token = introspectRequest.getToken();

        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        return IntrospectResponse.builder()
                .valid(verified && expirationTime.after(new Date()))
                .build();

    }

    private String generateToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername()) // Sử dụng tên người dùng làm chủ đề của token
                .issuer("nvnthinh.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("userId", user.getId()) // Thêm id của người dùng vào token
                .claim("email", user.getEmail())
                .claim("role", user.getRoles())// Thêm email của người dùng vào token
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }


}
