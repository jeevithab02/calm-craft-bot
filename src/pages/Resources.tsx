import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Phone, MessageCircle, Globe, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Resources = () => {
  const navigate = useNavigate();

  const helplines = [
    {
      name: "Vandrevala Foundation",
      number: "1860 2662 345 or 1800 2333 330",
      description: "24/7 free mental health support and crisis helpline",
      icon: Phone,
    },
    {
      name: "AASRA",
      number: "91-9820466726",
      description: "24/7 crisis support for people in emotional distress",
      icon: Heart,
    },
    {
      name: "iCall Helpline",
      number: "91-22-25521111",
      description: "Psychosocial helpline (Mon-Sat, 8 AM - 10 PM)",
      icon: Phone,
    },
    {
      name: "Snehi Foundation",
      number: "91-22-27546669",
      description: "Emotional support for crisis and suicide prevention",
      icon: MessageCircle,
    },
    {
      name: "NIMHANS",
      number: "080-46110007",
      description: "Mental health support from India's premier institute",
      icon: Heart,
    },
  ];

  const onlineResources = [
    {
      name: "NIMHANS (National Institute of Mental Health)",
      url: "https://nimhans.ac.in",
      description: "Premier institute for mental health and neurosciences in India",
    },
    {
      name: "Mind.org.in",
      url: "https://www.mind.org.in",
      description: "Mental health resources and awareness in India",
    },
    {
      name: "The Live Love Laugh Foundation",
      url: "https://www.thelivelovelaughfoundation.org",
      description: "Mental health awareness and resources",
    },
    {
      name: "MPower (Mpower Centre)",
      url: "https://mpowerminds.com",
      description: "Mental health services and support",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-calm to-peaceful">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Crisis Resources</h1>
            <p className="text-muted-foreground">You're not alone. Help is available 24/7.</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>

        <div className="mb-8 p-6 bg-destructive/10 border-2 border-destructive/30 rounded-lg">
          <h2 className="text-xl font-semibold mb-2 text-destructive flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Emergency
          </h2>
          <p className="text-muted-foreground mb-2">
            If you're in immediate danger or having thoughts of harming yourself or others, call 112 (Emergency Services) or go to your nearest emergency room.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Crisis Helplines</h2>
            <div className="space-y-4">
              {helplines.map((helpline) => (
                <Card key={helpline.name} className="p-6 border-primary/20 hover:border-primary/40 transition-all">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-serene flex items-center justify-center flex-shrink-0">
                      <helpline.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{helpline.name}</h3>
                      <p className="text-lg font-bold text-primary mb-2">{helpline.number}</p>
                      <p className="text-sm text-muted-foreground">{helpline.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Online Resources</h2>
            <div className="space-y-4">
              {onlineResources.map((resource) => (
                <Card key={resource.name} className="p-6 border-primary/20 hover:border-primary/40 transition-all">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center flex-shrink-0">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{resource.name}</h3>
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline mb-2 block"
                      >
                        {resource.url}
                      </a>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <Card className="p-6 border-primary/20">
          <h2 className="text-xl font-semibold mb-4 text-foreground">When to Seek Professional Help</h2>
          <div className="grid md:grid-cols-2 gap-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Consider reaching out if you:</h3>
              <ul className="space-y-1">
                <li>• Feel sad or hopeless for extended periods</li>
                <li>• Have difficulty functioning in daily life</li>
                <li>• Experience panic attacks or severe anxiety</li>
                <li>• Have thoughts of self-harm</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Professional help includes:</h3>
              <ul className="space-y-1">
                <li>• Licensed therapists and counselors</li>
                <li>• Psychiatrists for medication management</li>
                <li>• Support groups and peer counseling</li>
                <li>• Crisis intervention services</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Resources;
