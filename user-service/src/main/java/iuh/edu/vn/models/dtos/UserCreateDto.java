package iuh.edu.vn.models.dtos;

import lombok.Data;

@Data
public class UserCreateDto {
    private int id;

    private String username;
    private String password;
    private String email;
}
