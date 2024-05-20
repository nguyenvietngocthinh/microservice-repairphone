package iuh.edu.vn.services;

import com.nimbusds.jose.JOSEException;
import iuh.edu.vn.models.dtos.request.AuthenticationRequest;
import iuh.edu.vn.models.dtos.request.IntrospectRequest;
import iuh.edu.vn.models.dtos.response.AuthenticationResponse;
import iuh.edu.vn.models.dtos.response.IntrospectResponse;

import java.text.ParseException;

public interface AuthenticationService {
    AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest);

    IntrospectResponse introspect(IntrospectRequest introspectRequest) throws JOSEException, ParseException;
}
