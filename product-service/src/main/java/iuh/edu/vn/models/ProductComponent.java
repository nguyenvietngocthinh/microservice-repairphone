package iuh.edu.vn.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "phone_components")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductComponent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String componentName;
    private double price;

}
