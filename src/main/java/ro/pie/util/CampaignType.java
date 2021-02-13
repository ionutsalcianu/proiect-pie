package ro.pie.util;


public enum CampaignType {
    christmas("Christmas",2413621),
    blackfriday( "BlackFriday", 2413667),
    easter( "Easter", 2413669);

    private String value;
    private int mailjetId;


    CampaignType(String name ,int mailjetId) {
        this.value = name;
        this.mailjetId = mailjetId;
    }

    public int getMailjetId() {
        return mailjetId;
    }

    public String getValue() {
        return value;
    }

    public static CampaignType getInstance(String name) {
        for (CampaignType type : values()) {
            if (type.getValue().equals(name)) {
                return type;
            }
        }
        throw new IllegalArgumentException("no CampaignType with value " + name);
    }
}


