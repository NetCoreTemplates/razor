using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace MyApp.Pages;

public class Page : PageModel
{
    [FromRoute]
    public string Slug { get; set; }
}