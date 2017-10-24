package selenium.tests;

import static org.junit.Assert.assertNotNull;

import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.HttpClientBuilder;
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

		HttpClient client = HttpClientBuilder.create().build();
		HttpPost post = new HttpPost(url);

		// add header
		//post.setHeader("User-Agent", USER_AGENT);

		String jsonString = new JSONObject()
                .put("X-GitHub-Event", "pull_request")
                .put("action", "opened")
                .put("number", "2")
                .put("pull_request", new JSONObject()
                     .put("user", new JSONObject()
                           .put("login", "goeltanmay"))
                     .put("head", new JSONObject()
                           .put("sha", ""))
                     .put("base", new JSONObject()
                             .put("sha", "")))
                .put("repository", new JSONObject()
                     .put("name", "mesosphere_challenge")).toString();
		System.out.println(jsonString);
		//post.setEntity(new UrlEncodedFormEntity(jsonString));
        driver.get("https://github.com/goeltanmay/mesosphere_challenge/pull/4");
        
        WebDriverWait wait = new WebDriverWait(driver, 30);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[@class='timeline-comment-wrapper js-comment-container'][last()]//relative-time")));
        WebElement spans = driver.findElement(By.xpath("//div[@class='timeline-comment-wrapper js-comment-container'][last()]//relative-time"));
        System.out.println(spans.getAttribute("datetime").toString());
        assertNotNull(spans);
        //assertEquals(5, spans);
    }

}
