package lipunmyynti.ticketguru.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "postinumero")
public class Postinumero {

    @Id
    @Column(length = 5)
    @NotBlank(message = "Postinumero on pakollinen")
    @Size(min = 5, max = 5, message = "Postinumeron pitää olla 5 merkkiä pitkä.")
    @Pattern(regexp = "^[0-9]{5}$", message = "Postinumero voi sisältää vain numeroita.")
    private String postinumero;

    @NotBlank(message = "Postitoimipaikka on pakollinen")
    @Size(max = 50, message = "Postitoimipaikka voi olla enintään 50 merkkiä pitkä.")
    private String postitoimipaikka;

    public Postinumero() {
    }

    public Postinumero(String postinumero, String postitoimipaikka) {
        this.postinumero = postinumero;
        this.postitoimipaikka = postitoimipaikka;
    }

    public String getPostinumero() {
        return postinumero;
    }

    public void setPostinumero(String postinumero) {
        this.postinumero = postinumero;
    }

    public String getPostitoimipaikka() {
        return postitoimipaikka;
    }

    public void setPostitoimipaikka(String postitoimipaikka) {
        this.postitoimipaikka = postitoimipaikka;
    }

    @Override
    public String toString() {
        return "Postinumero [postinumero=" + postinumero
                + ", postitoimipaikka=" + postitoimipaikka + "]";
    }
}