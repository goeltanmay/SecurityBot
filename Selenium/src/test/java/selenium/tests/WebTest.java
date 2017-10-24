package selenium.tests;

import static org.junit.Assert.assertNotNull;

import java.time.Instant;
import java.util.Date;

import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClients;
import org.json.JSONObject;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.ChromeDriverManager;

public class WebTest
{
	private static WebDriver driver;
	
	@BeforeClass
	public static void setUp() throws Exception 
	{
		//driver = new HtmlUnitDriver();
		ChromeDriverManager.getInstance().setup();
		driver = new ChromeDriver();
	}
	
	@AfterClass
	public static void  tearDown() throws Exception
	{
		driver.close();
		driver.quit();
	}

	@Test
    public void pullRequestComment() throws Exception
    {
		String url = "https://desolate-fortress-49649.herokuapp.com/githook";
		HttpClient httpClient = HttpClients.createDefault();
		HttpPost post = new HttpPost(url);

		// add header
		post.setHeader("content-type", "application/json");
		post.setHeader("X-GitHub-Event", "pull_request");
		
		String jsonString = new JSONObject()
                .put("X-GitHub-Event", "pull_request")
                .put("action", "opened")
                .put("number", "4")
                .put("pull_request", new JSONObject()
                     .put("user", new JSONObject()
                           .put("login", "goeltanmay"))
                     .put("head", new JSONObject()
                           .put("sha", "92f98cee44d54f92c57378a515f817b884dc14a1"))
                     .put("base", new JSONObject()
                             .put("sha", "0bd3158ba40ec0d273242e0d9332a525a807debb")))
                .put("repository", new JSONObject()
                     .put("name", "mesosphere_challenge")).toString();
		StringEntity stringEntity = new StringEntity(jsonString);
		post.setEntity(stringEntity);
		httpClient.execute(post);
		
		Thread.sleep(30000L);
        driver.get("https://github.com/goeltanmay/mesosphere_challenge/pull/4");
        
        WebDriverWait wait = new WebDriverWait(driver, 30);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[@class='timeline-comment-wrapper js-comment-container'][last()]//relative-time")));
        WebElement spans = driver.findElement(By.xpath("//div[@class='timeline-comment-wrapper js-comment-container'][last()]//relative-time"));
        System.out.println(spans.getAttribute("datetime").toString());
        Date date = Date.from( Instant.parse( spans.getAttribute("datetime").toString() ));
        Date nowdate = Date.from(Instant.now());
        System.out.println(date);
        System.out.println(nowdate.getTime() - date.getTime());
        assertNotNull(spans);
        //assertEquals(5, spans);
    }
}
