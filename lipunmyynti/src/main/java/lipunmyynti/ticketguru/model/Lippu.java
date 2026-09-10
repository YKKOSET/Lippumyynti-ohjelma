package lipunmyynti.ticketguru.model;

import jakarta.persistence.*;


@Entity
@Table(name = "lippu")

public class Lippu 
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_;

    private int esitysId_;
    private int tyyppiId_;
    private int hinta_;
    private boolean kaytetty_;


    //constructors
    public Lippu()        {}

    public Lippu(int esitysId, int tyyppiId, int hinta, boolean kaytetty)
    {
        esitysId_ = esitysId;
        tyyppiId_ = tyyppiId;
        hinta_ = hinta;
        kaytetty_ = kaytetty;
    }


    //setters and getters
    public Long getId_()                        { return id_; }

    public void setId_(Long id)                 { id_ = id; }

    public int getEsitysId_()                   { return esitysId_; }

    public void setEsitysId_(int esitysId)      { esitysId_ = esitysId; }

    public int getTyyppiId_()                   { return tyyppiId_; }

    public void setTyyppiId_(int tyyppiId)      { tyyppiId_ = tyyppiId; }

    public int getHinta_()                      { return hinta_; }

    public void setHinta_(int hinta)            { hinta_ = hinta; }

    public boolean isKaytetty_()                { return kaytetty_; }

    public void setKaytetty_(boolean kaytetty)  { kaytetty_ = kaytetty; }


    //to string method
    @Override
    public String toString() 
    {
        return "Lippu [id_=" + id_ + ", esitysId_=" + esitysId_ + ", tyyppiId_=" + tyyppiId_ + ", hinta_=" + hinta_
                + ", kaytetty_=" + kaytetty_ + "]";
    }
}
