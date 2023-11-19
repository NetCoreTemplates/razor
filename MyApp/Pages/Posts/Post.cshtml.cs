using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

public class PostModel : PageModel
{
    [FromRoute]
    public string? Slug { get; set; }
}