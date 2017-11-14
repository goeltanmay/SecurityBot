package selenium.tests;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.io.IOException;
import java.time.Instant;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.RandomStringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPatch;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
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
	private String token = "token " + System.getenv("GITHUB_TOKEN");
	private String happyRepo = "PatientsApp";
	private String altRepo = "mesosphere_challenge";
	private String pull_req_branch = "sec_test";
	private int installationId = 59503;

	private HttpResponse githubRequestGet(String url) throws ClientProtocolException, IOException{
		String base_url = "https://api.github.com/";
		HttpClient httpClient = HttpClients.createDefault();
		HttpGet get = new HttpGet(base_url + url);

		// add header
		get.setHeader("content-type", "application/json");
		get.setHeader("Authorization", this.token);

		HttpResponse resp = httpClient.execute(get);
		return resp;
	}

	private HttpResponse githubRequestDelete(String url) throws ClientProtocolException, IOException{
		String base_url = "https://api.github.com/";
		HttpClient httpClient = HttpClients.createDefault();
		HttpDelete delete = new HttpDelete(base_url + url);

		// add header
		delete.setHeader("content-type", "application/json");
		delete.setHeader("Authorization", this.token);
		delete.setHeader("Accept", "application/vnd.github.machine-man-preview+json");

		HttpResponse resp = httpClient.execute(delete);
		return resp;
	}

	private HttpResponse githubRequestPut(String url, String body) throws ClientProtocolException, IOException{
		String base_url = "https://api.github.com/";
		HttpClient httpClient = HttpClients.createDefault();
		HttpPut post = new HttpPut(base_url + url);

		// add header
		post.setHeader("content-type", "application/json");
		post.setHeader("Authorization", this.token);
		post.setHeader("Accept", "application/vnd.github.machine-man-preview+json");

		StringEntity stringEntity = new StringEntity(body);
		post.setEntity(stringEntity);
		HttpResponse resp = httpClient.execute(post);
		return resp;
	}

	private HttpResponse githubRequestPost(String url, String body) throws ClientProtocolException, IOException{
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
		String git_url = "/repos/goeltanmay/PatientsApp/pulls";
		HttpResponse resp  = githubRequestPost(git_url, gitRequestBody.toString());
		HttpEntity entity = resp.getEntity();
		String responseString = EntityUtils.toString(entity, "UTF-8");
		JSONObject pull_response = new JSONObject(responseString);
		int pull_number = pull_response.getInt("number");
		String pull_head_sha = ((JSONObject) pull_response.get("head")).getString("sha");
		String pull_base_sha = ((JSONObject) pull_response.get("base")).getString("sha");

		Thread.sleep(15000L);


		try {
			driver.get("https://github.com/goeltanmay/PatientsApp/pull/" + pull_number);
			WebDriverWait wait = new WebDriverWait(driver, 10);
			wait.until(ExpectedConditions.visibilityOfElementLocated(
					By.xpath("//div[@class='timeline-comment-wrapper js-comment-container']//strong/a[.='robocop']")));
			List<WebElement> comments = driver.findElements(
					By.xpath("//div[@class='timeline-comment-wrapper js-comment-container']//strong/a[.='robocop']"));
			System.out.println(comments.get(comments.size() - 1).getText());
			WebElement commentTime = comments.get(comments.size() - 1).findElement(By.xpath("//relative-time"));
			System.out.println(commentTime.getAttribute("datetime").toString());
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
			git_url = "/repos/goeltanmay/PatientsApp/pulls/"+ pull_number;
			resp  = githubRequestPatch(git_url, gitRequestBody.toString());
			entity = resp.getEntity();
			responseString = EntityUtils.toString(entity, "UTF-8");
			System.out.println(responseString);
		}
	}

	@Test
	public void pullRequestCommentalternate() throws Exception {
		// making a new pull request on github
		JSONObject gitRequestBody =  new JSONObject()
				.put("head", pull_req_branch)
				.put("base", "master")
				.put("title", "Testing pull request");
		String git_url = "/repos/goeltanmay/"+ altRepo +"/pulls";
		HttpResponse resp  = githubRequestPost(git_url, gitRequestBody.toString());
		HttpEntity entity = resp.getEntity();
		String responseString = EntityUtils.toString(entity, "UTF-8");
		JSONObject pull_response = new JSONObject(responseString);
		int pull_number = pull_response.getInt("number");
		String pull_head_sha = ((JSONObject) pull_response.get("head")).getString("sha");
		String pull_base_sha = ((JSONObject) pull_response.get("base")).getString("sha");

		Thread.sleep(15000L);


		try {
			driver.get("https://github.com/goeltanmay/"+altRepo+"/pull/" + pull_number);
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
			assertNull(comments);
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println(e.toString());
			assertTrue(true);
		} finally {
			// closing the pull request
			System.out.println("In Finally");
			gitRequestBody =  new JSONObject()
					.put("state", "closed");
			git_url = "/repos/goeltanmay/"+altRepo+"/pulls/"+ pull_number;
			resp  = githubRequestPatch(git_url, gitRequestBody.toString());
			entity = resp.getEntity();
			responseString = EntityUtils.toString(entity, "UTF-8");
			System.out.println(responseString);
		}
	}

	@Test
	public void commitComment() throws Exception {
		// creating and committing a new file with random name
		String filename = RandomStringUtils.randomAlphanumeric(17).toUpperCase() + ".txt";
		JSONObject json = new JSONObject()
				.put("path", "filename")
				.put("message", "testing")
				.put("content", "bXkgbmV3IGZpbGUgY29udGVudHM=")
				.put("branch", "test_push");
		String jsonString = json.toString();
		String url = "/repos/goeltanmay/PatientsApp/contents/"+filename;
		HttpResponse resp = githubRequestPut(url, jsonString);
		HttpEntity entity = resp.getEntity();
		String responseString = EntityUtils.toString(entity, "UTF-8");
		JSONObject pull_response = new JSONObject(responseString);
		String file_sha = ((JSONObject)pull_response.get("content")).getString("sha");
		String commit_sha = ((JSONObject)pull_response.get("commit")).getString("sha");

		Thread.sleep(5000L);

		driver.get("https://github.com/goeltanmay/PatientsApp/commit/" + commit_sha);
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

	@Test
	public void commitCommentalternate() throws Exception {
		// creating and committing a new file with random name
		String filename = RandomStringUtils.randomAlphanumeric(17).toUpperCase() + ".txt";
		JSONObject json = new JSONObject()
				.put("path", "filename")
				.put("message", "testing")
				.put("content", "bXkgbmV3IGZpbGUgY29udGVudHM=")
				.put("branch", "test_push");
		String jsonString = json.toString();
		String url = "/repos/goeltanmay/"+ altRepo +"/contents/"+filename;
		HttpResponse resp = githubRequestPut(url, jsonString);
		HttpEntity entity = resp.getEntity();
		String responseString = EntityUtils.toString(entity, "UTF-8");
		JSONObject pull_response = new JSONObject(responseString);
		String file_sha = ((JSONObject)pull_response.get("content")).getString("sha");
		String commit_sha = ((JSONObject)pull_response.get("commit")).getString("sha");

		Thread.sleep(5000L);
		try {
			driver.get("https://github.com/goeltanmay/"+altRepo+"/commit/" + commit_sha);
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
		} catch (Exception e) {
			// TODO: handle exception
			// if driver is going to timeout, then good test because there is no comment
			System.out.println(e.toString());
		}

	}

	@Test
	public void createIssue() throws Exception {

		String getRepoUrl = "/repos/goeltanmay/PatientsApp";
		HttpResponse resp  = githubRequestGet(getRepoUrl);
		HttpEntity entity = resp.getEntity();
		String responseString = EntityUtils.toString(entity, "UTF-8");
		JSONObject repoResponse = new JSONObject(responseString);
		System.out.println(repoResponse);
		int repositoryId = repoResponse.getInt("id");

		String gitUrl = "/user/installations/" + installationId + "/repositories/" + repositoryId;

		githubRequestDelete(gitUrl);

		githubRequestPut(gitUrl, "");

		Thread.sleep(5000L);

		driver.get("https://github.com/goeltanmay/PatientsApp/issues");
		WebDriverWait wait = new WebDriverWait(driver, 20);
		wait.until(ExpectedConditions.visibilityOfElementLocated(
				By.xpath("//div[@class='float-left col-9 p-2 lh-condensed']//span[@class='opened-by']/a[.='robocop']")));
		List<WebElement> issuesList = driver.findElements(
				By.xpath("//div[@class='float-left col-9 p-2 lh-condensed']//span[@class='opened-by']/a[.='robocop']"));
		System.out.println(issuesList.get(0).getText());
		WebElement issueTime = issuesList.get(0).findElement(By.xpath("//relative-time"));
		Date date = Date.from(Instant.parse(issueTime.getAttribute("datetime").toString()));
		Date nowdate = Date.from(Instant.now());
		System.out.println(nowdate.getTime() - date.getTime());
		assertNotNull(issueTime);
		assertTrue("No recent issue found!", (nowdate.getTime() - date.getTime()) < 60000);
	}

	@Test
	public void createIssueAlternate() throws Exception {

		String getRepoUrl = "/repos/goeltanmay/" + altRepo;
		HttpResponse resp  = githubRequestGet(getRepoUrl);
		HttpEntity entity = resp.getEntity();
		String responseString = EntityUtils.toString(entity, "UTF-8");
		JSONObject repoResponse = new JSONObject(responseString);
		System.out.println(repoResponse);
		int repositoryId = repoResponse.getInt("id");

		String gitUrl = "/user/installations/" + installationId + "/repositories/" + repositoryId;

		githubRequestDelete(gitUrl);

		githubRequestPut(gitUrl, "");

		Thread.sleep(5000L);

		try {
			driver.get("https://github.com/goeltanmay/"+ altRepo +"/issues");
			WebDriverWait wait = new WebDriverWait(driver, 20);
			wait.until(ExpectedConditions.visibilityOfElementLocated(
					By.xpath("//div[@class='float-left col-9 p-2 lh-condensed']//span[@class='opened-by']/a[.='robocop']")));
			List<WebElement> issuesList = driver.findElements(
					By.xpath("//div[@class='float-left col-9 p-2 lh-condensed']//span[@class='opened-by']/a[.='robocop']"));
			System.out.println(issuesList.get(0).getText());
			WebElement issueTime = issuesList.get(0).findElement(By.xpath("//relative-time"));
			Date date = Date.from(Instant.parse(issueTime.getAttribute("datetime").toString()));
			Date nowdate = Date.from(Instant.now());
			System.out.println(nowdate.getTime() - date.getTime());
			assertFalse("No recent issue found!", (nowdate.getTime() - date.getTime()) < 60000);

		} catch (Exception e) {
			// This is a good test as we want the driver to timeout because it doesn't find the issue
			System.out.println("test passed");
		}
	}
}
