package ro.pie.service;

import com.mailjet.client.ClientOptions;
import com.mailjet.client.MailjetClient;
import com.mailjet.client.MailjetRequest;
import com.mailjet.client.MailjetResponse;
import com.mailjet.client.errors.MailjetException;
import com.mailjet.client.errors.MailjetSocketTimeoutException;
import com.mailjet.client.resource.Emailv31;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

@Service
public class MailjetService {
    MailjetClient client;
    MailjetRequest request;
    MailjetResponse response;

    DateFormat df = new SimpleDateFormat("dd.MM.yyyy");

    private static final int STANDARD_COUPON = 2399862;

    public MailjetService(){
        client = new MailjetClient("e10ae90bfbe838d69f71e57820348576", "7b01854bb959e9e335b1d7d55e3ffc0e", new ClientOptions("v3.1"));
    }

    public void sendEmail(String sendTo,String firstName, Long discount, String code, Date expireDate) throws MailjetSocketTimeoutException, MailjetException {
        request = new MailjetRequest(Emailv31.resource)
                .property(Emailv31.MESSAGES, new JSONArray()
                        .put(new JSONObject()
                                .put(Emailv31.Message.FROM, new JSONObject()
                                        .put("Email", "robert.taekwondo@gmail.com")
                                        .put("Name", "coupon service"))
                                .put(Emailv31.Message.TO, new JSONArray()
                                        .put(new JSONObject()
                                                .put("Email", sendTo)
                                                .put("Name", firstName)))
                                .put(Emailv31.Message.TEMPLATEID, STANDARD_COUPON)
                                .put(Emailv31.Message.TEMPLATELANGUAGE, true)
                                .put(Emailv31.Message.SUBJECT, "New Coupon")
                                .put(Emailv31.Message.VARIABLES, new JSONObject()
                                        .put("name", firstName)
                                        .put("discount", discount.toString())
                                        .put("expireDate", df.format(expireDate))
                                        .put("code", code))));
        response = client.post(request);
        System.out.println(response.getStatus());
        System.out.println(response.getData());
    }

    public void sendCampaign(int campaignId, String sendTo, String firstName, String couponCode, Date expireDate, Long couponValue) throws MailjetSocketTimeoutException, MailjetException {
        request = new MailjetRequest(Emailv31.resource)
                .property(Emailv31.MESSAGES, new JSONArray()
                        .put(new JSONObject()
                                .put(Emailv31.Message.FROM, new JSONObject()
                                        .put("Email", "robert.taekwondo@gmail.com")
                                        .put("Name", "coupon-service"))
                                .put(Emailv31.Message.TO, new JSONArray()
                                        .put(new JSONObject()
                                                .put("Email", sendTo)
                                                .put("Name", firstName)))
                                .put(Emailv31.Message.TEMPLATEID, campaignId)
                                .put(Emailv31.Message.TEMPLATELANGUAGE, true)
                                .put(Emailv31.Message.SUBJECT, "Here is a present for you")
                                .put(Emailv31.Message.VARIABLES, new JSONObject()
                                        .put("name", firstName)
                                        .put("expiredDate", df.format(expireDate))
                                        .put("couponValue", couponValue)
                                        .put("couponCode", couponCode))));
        response = client.post(request);
        System.out.println(response.getStatus());
        System.out.println(response.getData());
    }
}
