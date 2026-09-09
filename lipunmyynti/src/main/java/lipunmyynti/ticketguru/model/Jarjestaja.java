package lipunmyynti.ticketguru.model;

import jakarta.persistence.*;

@Entity

public class Jarjestaja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String etunimi;
    private String sukunimi;
    private String sahkoposti;
    private String puhelin;

    // @OneToMany(mappedBy = "jarjestaja")
    // private List<Tapahtuma> tapahtumat;


    public Jarjestaja() {
    }

    public Jarjestaja(String etunimi, String sukunimi, String sahkoposti, String puhelin) {
        this.etunimi = etunimi;
        this.sukunimi = sukunimi;
        this.sahkoposti = sahkoposti;
        this.puhelin = puhelin;
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

    @Override
    public String toString() {
        return "Jarjestaja [etunimi=" + etunimi + ", sukunimi=" + sukunimi + ", sahkoposti=" + sahkoposti + ", puhelin="
                + puhelin + "]";
    }

}
