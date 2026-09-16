package lipunmyynti.ticketguru.model;



import java.util.List;

import jakarta.persistence.*;

@Entity 
@Table (name = "asiakas")

public class Asiakas {

@Id 
@GeneratedValue (strategy = GenerationType.IDENTITY)
private Long id;

private String etunimi;
private String sukunimi;
private String sahkoposti;
private String puhelin;

@OneToMany (mappedBy = "asiakas")
private List<Osto> ostot;

public Asiakas() {
}

public Asiakas(String etunimi, String sukunimi, String sahkoposti, String puhelin) {
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
    return "Asiakas [etunimi=" + etunimi + ", sukunimi=" + sukunimi + ", sahkoposti=" + sahkoposti + ", puhelin="
            + puhelin + "]";
}


}
