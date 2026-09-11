package lipunmyynti.ticketguru.model;

import jakarta.persistence.*;

@Entity
@Table(name = "paikka")

public class Paikka {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nimi;
    private String katuosoite;
    private String postinumero;

    public Paikka() {
    }

    public Paikka(Long id, String nimi, String katuosoite, String postinumero) {
        this.id = id;
        this.nimi = nimi;
        this.katuosoite = katuosoite;
        this.postinumero = postinumero;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNimi(String nimi) {
        this.nimi = nimi;
    }

    public void setKatuosoite(String katuosoite) {
        this.katuosoite = katuosoite;
    }

    public void setPostinumero(String postinumero) {
        this.postinumero = postinumero;
    }

    public Long getId() {
        return id;
    }

    public String getNimi() {
        return nimi;
    }

    public String getKatuosoite() {
        return katuosoite;
    }

    public String getPostinumero() {
        return postinumero;
    }

    @Override
    public String toString() {
        return "Paikka [id=" + id + ", nimi=" + nimi + ", katuosoite=" + katuosoite + ", postinumero=" + postinumero + "]";
    }

}
