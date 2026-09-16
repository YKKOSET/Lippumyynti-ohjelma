package lipunmyynti.ticketguru.model;

import jakarta.persistence.*;

@Entity
@Table(name = "postinumero")

public class Postinumero {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String postinumero;
    private String postitoimipaikka;

    public Postinumero() {
    }

    public Postinumero(Long id, String postinumero, String postitoimipaikka) {
        this.id = id;
        this.postinumero = postinumero;
        this.postitoimipaikka = postitoimipaikka;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setPostinumero(String postinumero) {
        this.postinumero = postinumero;
    }

    public void setPostitoimipaikka(String postitoimipaikka) {
        this.postitoimipaikka = postitoimipaikka;
    }

    public Long getId() {
        return id;
    }

    public String getPostinumero() {
        return postinumero;
    }

    public String getPostitoimipaikka() {
        return postitoimipaikka;
    }

    @Override
    public String toString() {
        return "Postinumero [id=" + id + ", postinumero=" + postinumero + ", postitoimipaikka=" + postitoimipaikka + "]";
    }

}
