package selenium.tests;

import static org.junit.Assert.*;

import java.util.List;

import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
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
	public void googleExists() throws Exception
	{
		driver.get("http://www.google.com");
        assertEquals("Google", driver.getTitle());		
	}
	
	@Test
	public void FrustrationCount() throws Exception {
		driver.get("http://www.checkbox.io/studies.html");
		
		// http://geekswithblogs.net/Aligned/archive/2014/10/16/selenium-and-timing-issues.aspx
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[@class='span8']//span[.='Frustration of Software Developers']")));
		WebElement title = driver.findElement(By.xpath("//div[@class='span8']//span[.='Frustration of Software Developers']"));
		WebElement row = title.findElement(By.xpath("../../../*[2]//p[1]//span[1]"));
		assertEquals(row.getText(),"55");
	}
	
	@Test
	public void amazonRewardImage() throws Exception {
		driver.get("http://www.checkbox.io/studies.html");
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[@class='span8']//span[.='Frustration of Software Developers']")));
		WebElement title = driver.findElement(By.xpath("//div[@class='span8']//span[.='Software Changes Survey']"));
		System.out.println(title.getText());
		WebElement amazonImage = title.findElement(By.xpath("../..//img[@src='/media/amazongc-micro.jpg']"));
		assertNotNull(amazonImage);
	}
	

	@Test
	public void OpenStudyClickable() throws Exception {
		driver.get("http://www.checkbox.io/studies.html");
		
		// http://geekswithblogs.net/Aligned/archive/2014/10/16/selenium-and-timing-issues.aspx
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[@class='span8']//span[.='Frustration of Software Developers']")));
		List<WebElement> spans = driver.findElements(By.xpath("//a[@class='status']//span[.='OPEN']"));
		int count = 0;
		for (WebElement span : spans){
			WebElement parent = span.findElement(By.xpath("../../.."));			
			WebElement participateButton = parent.findElement(By.xpath(".//button"));
			if (participateButton.isDisplayed() && participateButton.isEnabled()) {
				ExpectedConditions.elementToBeClickable(participateButton);
				participateButton.click();
			}
			count++;
		}
		assertEquals(count,11);
	}

	@Test
	public void Closed() throws Exception
	{
		driver.get("http://www.checkbox.io/studies.html");
		
		// http://geekswithblogs.net/Aligned/archive/2014/10/16/selenium-and-timing-issues.aspx
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//a[@class='status']/span[.='CLOSED']")));
		List<WebElement> spans = driver.findElements(By.xpath("//a[@class='status']/span[.='CLOSED']"));

		assertNotNull(spans);
		assertEquals(5, spans.size());
	}

}
