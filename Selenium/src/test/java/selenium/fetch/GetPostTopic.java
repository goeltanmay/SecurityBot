package selenium.fetch;

import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.opencsv.CSVReader;
import com.opencsv.CSVWriter;

import io.github.bonigarcia.wdm.ChromeDriverManager;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


public class GetPostTopic 
{
	private static WebDriver driver;

	public void Init()
	{
		ChromeDriverManager.getInstance().setup();
		ChromeOptions options = new ChromeOptions();

	    //use the block image extension to prevent images from downloading.
	    options.addExtensions(new File("Block-image_v1.1.crx"));
		driver = new ChromeDriver(options);
	}
	
	
	public String GetTopic(String postUrl)
	{
		String topic = "";
		driver.get(postUrl);
        
		// Wait a few seconds for our topic to appear.
		try
		{
			WebDriverWait wait = new WebDriverWait(driver, 10);
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[@rel='topic-item']")));
			
			WebElement element = driver.findElement(By.xpath("//div[@rel='topic-item']/span/a/div"));
			if( element != null )
			{
				topic = element.getText();
			}
		}
		catch(TimeoutException t)
		{
			System.out.println("Timed out trying to get " + postUrl);
		}
        return topic;
	}
	
	public static class Post
	{
		public String id;
		public String tagline;
		public String Url;
		public String topic;
	}
	
	public List<Post> ReadPostsCSV(String file)
	{
		
		List<Post> posts = new ArrayList<Post>();
		try 
		{
			// Skip first line (header), use ; for delim, " for quotes.
			CSVReader reader = new CSVReader(new FileReader(file), ';', '\"', 1 );

			String[] line;
			while ((line = reader.readNext()) != null) 
			{
				Post p = new Post();
				p.id = line[0];
				p.tagline = line[3];
				p.Url = line[9];
				//System.out.println(p.id + "," + p.tagline + "," + p.Url);
				posts.add(p);
			}
			reader.close();
		} 
		catch (FileNotFoundException e) {
			e.printStackTrace();
		} 
		catch (IOException e) {
			e.printStackTrace();
		}		
		return posts;
	}
	
	public void close()
	{
		driver.close();
	}
	
	public static void main(String[] args) throws InterruptedException, IOException
	{
		GetPostTopic scrapper = new GetPostTopic();
		scrapper.Init();

		List<Post> posts = scrapper.ReadPostsCSV("/Users/gameweld/data/product-hunt/posts--2016-04-01_14-36-24-UTC.csv");

		int stopAfter = 0;
		for( Post p: posts )
		{
			//if( stopAfter >= 10 )
			//	break;
			
			if( p.Url != null && !p.equals("") )
			{
				String topic = scrapper.GetTopic(p.Url);
				System.out.println(p.Url + "," + topic);
				p.topic = topic;

				// Be  polite, wait
				Thread.sleep(200);
			}
			stopAfter++;
		}
		
		CSVWriter writer = new CSVWriter(new FileWriter("postsWithTopics.csv"), ';');
		writer.writeNext(new String[]{"id", "tagline", "url", "topic"});
		for( Post p : posts )
		{
			writer.writeNext(new String[]{p.id, p.tagline,p.Url, p.topic});
		}
		writer.close();
		scrapper.close();
	}
}
