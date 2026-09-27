package lipunmyynti.ticketguru.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@JsonIgnoreProperties("tapahtumat") // prevent loop between events and organizers
@Table(name = "jarjestaja")

public class Jarjestaja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //auto-generation
    @Column(nullable = false, updatable = false) //not null, not update
    private Long id;

    @Size(max = 50, message = "Etunimi voi olla enintään 50 merkkiä pitkä.") //it can also be empty
    private String etunimi;

    @Size(max = 100, message = "Sukunimi voi olla enintään 100 merkkiä pitkä.")
    private String sukunimi;

    @Email(message = "Sähköpostiosoite tulee kirjoittaa oikeassa muodossa.")
    @Size(max = 300, message = "Sähköpostiosoite voi olla enintään 300 merkkiä pitkä.")
    private String sahkoposti;

    @Size(max = 20, message = "Puhelinnumero voi olla enintään 20 merkkiä pitkä.")
    @Pattern(regexp = "^\\+?[0-9]*$", message = "Puhelinnumero voi sisältää vain numeroita ja voi alkaa + -merkillä.")
    private String puhelin;

    @OneToMany(mappedBy = "jarjestaja")
    private List<Tapahtuma> tapahtumat;

    // constructors:

    public Jarjestaja() {
    }

    public Jarjestaja(String etunimi, String sukunimi, String sahkoposti, String puhelin) {
        this.etunimi = etunimi;
        this.sukunimi = sukunimi;
        this.sahkoposti = sahkoposti;
        this.puhelin = puhelin;
    }

    // getters & setters:

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEtunimi() {
        return etunimi;
    }

    public void setEtunimi(String etunimi) {
        this.etunimi = etunimi;
    }

    public String getSukunimi() {
        return sukunimi;
    }

    public void setSukunimi(String sukunimi) {
        this.sukunimi = sukunimi;
    }

    public String getSahkoposti() {
        return sahkoposti;
    }

    public void setSahkoposti(String sahkoposti) {
        this.sahkoposti = sahkoposti;
    }

    public String getPuhelin() {
        return puhelin;
    }

    public void setPuhelin(String puhelin) {
        this.puhelin = puhelin;
    }

    public List<Tapahtuma> getTapahtumat() {
        return tapahtumat;
    }

    public void setTapahtumat(List<Tapahtuma> tapahtumat) {
        this.tapahtumat = tapahtumat;
    }

    // toString:

    @Override
    public String toString() {
        return "Jarjestaja [id=" + id + ", etunimi=" + etunimi + ", sukunimi=" + sukunimi + ", sahkoposti=" + sahkoposti
                + ", puhelin=" + puhelin + "]";
    }

}
