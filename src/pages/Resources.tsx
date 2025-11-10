import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Phone, MessageCircle, Globe, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Resources = () => {
  const navigate = useNavigate();

  const helplines = [
    {
      name: "988 Suicide & Crisis Lifeline",
      number: "988",
      description: "24/7 free and confidential support for people in distress",
      icon: Phone,
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "Free, 24/7 crisis support via text message",
      icon: MessageCircle,
    },
    {
      name: "SAMHSA National Helpline",
      number: "1-800-662-4357",
      description: "Treatment referral and information service",
      icon: Phone,
    },
    {
      name: "NAMI Helpline",
      number: "1-800-950-6264",
      description: "Mental health information and support",
      icon: Heart,
    },
  ];

  const onlineResources = [
    {
      name: "MentalHealth.gov",
      url: "https://www.mentalhealth.gov",
      description: "Information on mental health and where to get help",
    },
    {
      name: "NAMI (National Alliance on Mental Illness)",
      url: "https://www.nami.org",
      description: "Advocacy, education, support and public awareness",
    },
    {
      name: "Mental Health America",
      url: "https://www.mhanational.org",
      description: "Tools and resources for mental wellness",
    },
    {
      name: "Therapy for Black Girls",
      url: "https://therapyforblackgirls.com",
      description: "Mental health resources for Black women and girls",
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
            If you're in immediate danger or having thoughts of harming yourself or others, call 911 or go to your nearest emergency room.
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
