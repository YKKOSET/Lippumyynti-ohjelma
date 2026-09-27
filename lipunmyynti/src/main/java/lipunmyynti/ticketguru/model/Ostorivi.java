package lipunmyynti.ticketguru.model;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "ostorivi")

public class Ostorivi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto-generation
    private Long id;

    @ManyToOne
    @JsonIgnore //prevent loop
    @NotNull(message = "Osto on pakollinen.") //not null in java
    @JoinColumn(nullable = false) //not null in db
    private Osto osto;

    @ManyToOne
    @NotNull(message = "Lippu on pakollinen.") //not null in java
    @JoinColumn(nullable = false) //not null in db
    private Lippu lippu;

    @NotNull (message = "Myyntihinta tulee antaa.") //not null in java
    @Column(nullable = false) //not null in db
    @DecimalMin("0.00") //not negative (0.00 is okay)
    private BigDecimal myyntihinta;

    // Constructors, getters & setters, toString begin:

    public Ostorivi() {
    }

    public Ostorivi(Osto osto, Lippu lippu, BigDecimal myyntihinta) {
        this.osto = osto;
        this.lippu = lippu;
        this.myyntihinta = myyntihinta;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Osto getOsto() {
        return osto;
    }

    public void setOsto(Osto osto) {
        this.osto = osto;
    }

    public Lippu getLippu() {
        return lippu;
    }

    public void setLippu(Lippu lippu) {
        this.lippu = lippu;
    }

    public BigDecimal getMyyntihinta() {
        return myyntihinta;
    }

    public void setMyyntihinta(BigDecimal myyntihinta) {
        this.myyntihinta = myyntihinta;
    }

    @Override
    public String toString() {
        return "Ostorivi [id=" + id + ", osto=" + osto + ", lippu=" + lippu + ", myyntihinta=" + myyntihinta + "]";
    }

}