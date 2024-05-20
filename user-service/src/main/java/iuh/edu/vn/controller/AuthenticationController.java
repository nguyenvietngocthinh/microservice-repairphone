package iuh.edu.vn.controller;

import com.nimbusds.jose.JOSEException;
import iuh.edu.vn.models.dtos.request.AuthenticationRequest;
import iuh.edu.vn.models.dtos.request.IntrospectRequest;
import iuh.edu.vn.models.dtos.response.AuthenticationResponse;
import iuh.edu.vn.models.dtos.response.IntrospectResponse;
import iuh.edu.vn.services.AuthenticationService;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin(origins = "http://127.0.0.1:5500/")
public class AuthenticationController {
    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/token")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest authenticationRequest) {
        AuthenticationResponse response = authenticationService.authenticate(authenticationRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/introspect")
    public ResponseEntity<IntrospectResponse> introspect(@RequestBody IntrospectRequest introspectRequest) throws ParseException, JOSEException {
        try {
            IntrospectResponse result = authenticationService.introspect(introspectRequest);
            return ResponseEntity.ok(result);
        } catch (JOSEException | ParseException e) {
            // Xử lý ngoại lệ nếu cần
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
