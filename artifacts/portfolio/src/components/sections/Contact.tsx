import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, Send, CheckCircle2, AlertCircle, Copy, Check, ArrowUp } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from "@/hooks/use-toast";
import { ScrollRevealText } from '../ui/ScrollRevealText';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;


export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const copyEmail = async () => {
    const email = 'sravankumar0103@gmail.com';
    
    try {
      // Primary method: Modern Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        // Fallback method: Hidden textarea (works on HTTP/Insecure contexts)
        const textArea = document.createElement("textarea");
        textArea.value = email;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      
      setCopied(true);
      toast({
        title: "Email Copied!",
        description: "My email has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Please copy the email manually.",
      });
    }
  };

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "5efdf489-27ba-41bd-baec-f7e6bebc647a",
          name: data.name,
          email: data.email,
          message: data.message,
          from_name: "Portfolio Contact",
        }),
      });

      const result = await response.json();
      if (result.success) {
        setIsSuccess(true);
        toast({ title: "Message Sent!", description: "I'll get back to you shortly." });
        reset();
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Please try again or email me directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="pt-4 md:pt-12 pb-2 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-start">

          {/* Info Side (Left) */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block text-[12px] font-sans text-primary uppercase tracking-[0.5em] mb-4 border-b border-primary/20 pb-2">
                Get In Touch
              </span>

              <h3 className="text-4xl sm:text-6xl md:text-7xl font-display font-medium text-foreground mb-6 tracking-tight leading-[1.1] md:leading-[0.95]">
                Let&apos;s build <br />
                <ScrollRevealText 
                  text="something" 
                  to="hsl(11, 81%, 57%)" 
                  from="rgba(255,255,255,0.1)"
                  className="italic tracking-tight" 
                /> <br />
                great.
              </h3>

              <p className="text-base text-muted-foreground font-sans font-light mb-8 md:mb-12 max-w-sm leading-relaxed opacity-70">
                I am currently open to new opportunities and interesting collaborations. Let’s create something impactful together.
              </p>

              <div className="space-y-8">
                <motion.div
                  className="group cursor-pointer inline-flex flex-col"
                  onClick={copyEmail}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-[10px] font-sans text-muted-foreground uppercase tracking-[0.3em] mb-2 group-hover:text-primary transition-colors">
                    Direct Email
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-lg sm:text-xl md:text-2xl font-sans text-foreground">
                      sravankumar0103@gmail.com
                    </span>
                    <motion.div 
                      className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-all duration-300"
                      animate={copied ? { scale: [1, 1.2, 1] } : {}}
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Form Side (Right) */}
          <div className="lg:col-span-7 pt-4 md:pt-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="premium-card rounded-2xl md:rounded-[2.5rem] p-5 md:p-12 relative w-full max-w-[92%] mx-auto lg:max-w-xl lg:ml-auto"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  <div className="relative group">
                    <input
                      {...register('name')}
                      type="text"
                      className="peer w-full bg-transparent border-b border-white/10 py-1 outline-none focus:border-primary transition-all font-sans text-sm placeholder-transparent"
                      id="name"
                      placeholder=" "
                    />
                    <label htmlFor="name" className="absolute left-0 top-1 text-muted-foreground transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-1 peer-focus:-top-5 peer-focus:text-[9px] peer-focus:text-primary peer-focus:tracking-[0.2em] peer-focus:uppercase uppercase text-[9px] tracking-[0.2em] -top-5 pointer-events-none opacity-60">
                      Name
                    </label>
                  </div>

                  <div className="relative group">
                    <input
                      {...register('email')}
                      type="email"
                      className="peer w-full bg-transparent border-b border-white/10 py-1 outline-none focus:border-primary transition-all font-sans text-sm placeholder-transparent"
                      id="email"
                      placeholder=" "
                    />
                    <label htmlFor="email" className="absolute left-0 top-1 text-muted-foreground transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-1 peer-focus:-top-5 peer-focus:text-[9px] peer-focus:text-primary peer-focus:tracking-[0.2em] peer-focus:uppercase uppercase text-[9px] tracking-[0.2em] -top-5 pointer-events-none opacity-60">
                      Email
                    </label>
                  </div>
                </div>

                <div className="relative group">
                  <textarea
                    {...register('message')}
                    className="peer w-full bg-transparent border-b border-white/10 py-1 outline-none focus:border-primary transition-all font-sans text-sm placeholder-transparent resize-none h-20"
                    id="message"
                    placeholder=" "
                  />
                  <label htmlFor="message" className="absolute left-0 top-1 text-muted-foreground transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-1 peer-focus:-top-5 peer-focus:text-[9px] peer-focus:text-primary peer-focus:tracking-[0.2em] peer-focus:uppercase uppercase text-[9px] tracking-[0.2em] -top-5 pointer-events-none opacity-60">
                    Message
                  </label>
                </div>

                <div className="flex justify-end pt-2">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || isSuccess}
                    className="relative group"
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`px-8 py-3 rounded-full font-sans font-bold uppercase tracking-[0.2em] text-[9px] transition-all duration-500 flex items-center justify-center gap-3 ${isSuccess ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-primary text-background group-hover:bg-white group-hover:shadow-[0_8px_15px_rgba(255,255,255,0.05)]'}`}>
                      <AnimatePresence mode="wait">
                        {isSubmitting ? (
                          <motion.div key="sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                            Sending
                          </motion.div>
                        ) : isSuccess ? (
                          <motion.div key="suc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3" />
                            Done
                          </motion.div>
                        ) : (
                          <motion.div key="idle" className="flex items-center gap-2">
                            <span>Send</span>
                            <Send className="w-2.5 h-2.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>

        {/* New Action Row (Full Width) */}
        <div className="flex justify-between items-center mt-10 md:mt-16 pt-8 border-t border-white/5">
          <div className="flex gap-4">
            <SocialIcon href="https://github.com/sravankumar0103" icon={<Github className="w-5 h-5" />} />
            <SocialIcon href="https://linkedin.com/in/diddi-sravan-kumar" icon={<Linkedin className="w-5 h-5" />} />
          </div>

          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-primary hover:text-background hover:bg-primary hover:border-primary transition-all duration-500 group shadow-lg"
            whileHover={{ y: -5, scale: 1.1 }}
            title="Back to top"
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300" />
          </motion.button>
        </div>
      </div>

      <footer className="mt-6 pb-6 border-t border-white/5 pt-6 text-center">
        <div className="text-[10px] font-sans text-muted-foreground uppercase tracking-[0.3em] opacity-50 leading-relaxed flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3">
          <span>© {new Date().getFullYear()} SRAVAN KUMAR DIDDI</span>
          <span className="hidden md:inline-block opacity-30">·</span>
          <span>DIGITAL PORTFOLIO</span>
        </div>
      </footer>
    </section>
  );
}

function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-500"
      whileHover={{ y: -5, scale: 1.1 }}
    >
      {icon}
    </motion.a>
  );
}
