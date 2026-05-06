namespace Shems.Api.DTOs;

public class SubscriptionUpdateDto
{
    // A list of the AlertProfile IDs the user SHOULD be subscribed to
    public List<int> AlertProfileIds { get; set; } = new List<int>();
}
