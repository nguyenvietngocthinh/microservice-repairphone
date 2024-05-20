package iuh.edu.vn.models;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.boot.autoconfigure.elasticsearch.ElasticsearchConnectionDetails;

import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String username;
    private String password;
    private String email;
    private Set<String> roles;
}
