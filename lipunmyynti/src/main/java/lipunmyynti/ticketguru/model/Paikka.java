package lipunmyynti.ticketguru.model;

import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "paikka")
public class Paikka {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Paikan nimi on pakollinen.")
    @Size(max = 200, message = "Paikan nimi voi olla enintään 200 merkkiä pitkä.")
    private String nimi;

    @NotBlank(message = "Katuosoite on pakollinen.")
    @Size(max = 100, message = "Katuosoite voi olla enintään 100 merkkiä pitkä.")
    private String katuosoite;

    @NotNull(message = "Postinumero on pakollinen.")
    @ManyToOne
    @JoinColumn(name = "postinumero")
    private Postinumero postinumero;

    @OneToMany(mappedBy = "paikka")
    private List<Esityskerta> esityskerrat;

    public Paikka() {
    }

    public Paikka(Long id, String nimi, String katuosoite, Postinumero postinumero) {
        this.id = id;
        this.nimi = nimi;
        this.katuosoite = katuosoite;
        this.postinumero = postinumero;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNimi() {
        return nimi;
    }

    public void setNimi(String nimi) {
        this.nimi = nimi;
    }

    public String getKatuosoite() {
        return katuosoite;
    }

    public void setKatuosoite(String katuosoite) {
        this.katuosoite = katuosoite;
    }

    public Postinumero getPostinumero() {
        return postinumero;
    }

    public void setPostinumero(Postinumero postinumero) {
        this.postinumero = postinumero;
    }

    public List<Esityskerta> getEsityskerrat() {
        return esityskerrat;
    }

    public void setEsityskerrat(List<Esityskerta> esityskerrat) {
        this.esityskerrat = esityskerrat;
    }

    @Override
    public String toString() {
        return "Paikka [id=" + id
                + ", nimi=" + nimi
                + ", katuosoite=" + katuosoite
                + ", postinumero=" + postinumero + "]";
    }
}