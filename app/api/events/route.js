// app/api/events/route.js
export async function GET() {
    // Example data (replace with actual data source or database query)
    const events = [
      { title: "News 1", description: "Lorem ipsum dolor sit amet", imageUrl: "https://picsum.photos/300/200?random=1" },
      { title: "Event 1", description: "Donec vel mauris lectus", imageUrl: "https://picsum.photos/300/200?random=2" },
      { title: "News 2", description: "Curabitur convallis orci ac nisl", imageUrl: "https://picsum.photos/300/200?random=3" },
      { title: "Event Amazon", description: "Mauris non placerat dui", imageUrl: "https://picsum.photos/300/200?random=4" },
      { title: "Daraz", description: "Sed accumsan gvh hggggg ggjghjhgj gj gjgjgjgg jhg jgjg jg jgjg jg jhg j gjhgjhg g jghgjhggjhg gjh gjg jgjg augue", imageUrl: "https://picsum.photos/300/200?random=5" },
      { title: "Picnic", description: "Phasellus pretium euismod", imageUrl: "https://picsum.photos/300/200?random=6" },
      { title: "Iftar", description: "Fusce vitae erat a eros", imageUrl: "https://picsum.photos/300/200?random=7" }
    ];
  
    return new Response(JSON.stringify(events), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }