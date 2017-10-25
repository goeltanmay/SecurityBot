package selenium.tests;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.time.Instant;
import java.util.Date;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPatch;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
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

public class WebTest {
	private static WebDriver driver;
	private String token = "token " + "cee0cbe7731d0f59054624be8485ea8d3d71faca";
	
	private HttpResponse githubRequest(String url, String body) throws ClientProtocolException, IOException{
		String base_url = "https://api.github.com/";
		HttpClient httpClient = HttpClients.createDefault();
		HttpPost post = new HttpPost(base_url + url);

		// add header
		post.setHeader("content-type", "application/json");
		post.setHeader("Authorization", this.token);

		StringEntity stringEntity = new StringEntity(body);
		post.setEntity(stringEntity);
		HttpResponse resp = httpClient.execute(post);
		return resp;
	}

	private HttpResponse githubRequestPatch(String url, String body) throws ClientProtocolException, IOException{
		String base_url = "https://api.github.com/";
		HttpClient httpClient = HttpClients.createDefault();
		HttpPatch patch = new HttpPatch(base_url + url);

		// add header
		patch.setHeader("content-type", "application/json");
		patch.setHeader("Authorization", this.token);

		StringEntity stringEntity = new StringEntity(body);
		patch.setEntity(stringEntity);
		HttpResponse resp = httpClient.execute(patch);
		return resp;
	}
	
	@BeforeClass
	public static void setUp() throws Exception {
		// driver = new HtmlUnitDriver();
		ChromeDriverManager.getInstance().setup();
		driver = new ChromeDriver();
	}

	@AfterClass
	public static void tearDown() throws Exception {
		driver.close();
		driver.quit();
	}

	@Test
	public void pullRequestComment() throws Exception {
		// making a new pull request on github
		JSONObject gitRequestBody =  new JSONObject()
				.put("head", "sec_test")
				.put("base", "master")
				.put("title", "Testing pull request");
		String git_url = "/repos/goeltanmay/mesosphere_challenge/pulls";
		HttpResponse resp  = githubRequest(git_url, gitRequestBody.toString());
		HttpEntity entity = resp.getEntity();
		String responseString = EntityUtils.toString(entity, "UTF-8");
		JSONObject pull_response = new JSONObject(responseString);
		int pull_number = pull_response.getInt("number");
		String pull_head_sha = ((JSONObject) pull_response.get("head")).getString("sha");
		String pull_base_sha = ((JSONObject) pull_response.get("base")).getString("sha");

		Thread.sleep(15000L);

		
		try {
			driver.get("https://github.com/goeltanmay/mesosphere_challenge/pull/" + pull_number);
			WebDriverWait wait = new WebDriverWait(driver, 10);
			wait.until(ExpectedConditions.visibilityOfElementLocated(
					By.xpath("//div[@class='timeline-comment-wrapper js-comment-container']//strong/a[.='robocop']")));
			List<WebElement> comments = driver.findElements(
					By.xpath("//div[@class='timeline-comment-wrapper js-comment-container']//strong/a[.='robocop']"));
			System.out.println(comments.get(comments.size() - 1).getText());
			WebElement commentTime = comments.get(comments.size() - 1).findElement(By.xpath("//relative-time"));

			Date date = Date.from(Instant.parse(commentTime.getAttribute("datetime").toString()));
			Date nowdate = Date.from(Instant.now());
			System.out.println(date);
			System.out.println(nowdate.getTime() - date.getTime());
			assertNotNull(comments);
			assertNotNull(commentTime);
			assertTrue("No recent comment!", (nowdate.getTime() - date.getTime()) < 60000);
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println(e.toString());
			fail(e.toString());
		} finally {
			// closing the pull request
			System.out.println("In Finally");
			gitRequestBody =  new JSONObject()
					.put("state", "closed");
			git_url = "/repos/goeltanmay/mesosphere_challenge/pulls/"+ pull_number;
			resp  = githubRequestPatch(git_url, gitRequestBody.toString());
			entity = resp.getEntity();
			responseString = EntityUtils.toString(entity, "UTF-8");
			System.out.println(responseString);
		}		
	}

	@Test
	public void commitComment() throws Exception {
		String url = "https://desolate-fortress-49649.herokuapp.com/githook";
		HttpClient httpClient = HttpClients.createDefault();
		HttpPost post = new HttpPost(url);

		// add header
		post.setHeader("content-type", "application/json");
		post.setHeader("X-GitHub-Event", "push");
		JSONObject json = new JSONObject().put("after", "0bd3158ba40ec0d273242e0d9332a525a807debb")
				.put("before", "b95d20ab721b72774f73d440dcb57de70127146a").put("repository", new JSONObject()
						.put("owner", new JSONObject().put("name", "goeltanmay")).put("name", "mesosphere_challenge"));
		String jsonString = json.toString();

		StringEntity stringEntity = new StringEntity(jsonString);
		post.setEntity(stringEntity);
		httpClient.execute(post);

		Thread.sleep(5000L);

		driver.get("https://github.com/goeltanmay/mesosphere_challenge/commit/" + json.get("after"));
		WebDriverWait wait = new WebDriverWait(driver, 10);
		wait.until(ExpectedConditions.visibilityOfElementLocated(
				By.xpath("//div[@class='timeline-comment-wrapper js-comment-container']//strong/a[.='robocop']")));
		List<WebElement> comments = driver.findElements(
				By.xpath("//div[@class='timeline-comment-wrapper js-comment-container']//strong/a[.='robocop']"));
		System.out.println(comments.get(comments.size() - 1).getText());
		WebElement commentTime = comments.get(comments.size() - 1).findElement(By.xpath("//relative-time"));

		Date date = Date.from(Instant.parse(commentTime.getAttribute("datetime").toString()));
		Date nowdate = Date.from(Instant.now());
		System.out.println(nowdate.getTime() - date.getTime());
		assertNotNull(commentTime);
		assertTrue("No recent comment!", (nowdate.getTime() - date.getTime()) < 15000);
	}
}
