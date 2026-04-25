import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, Send, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from "@/hooks/use-toast";

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

  const copyEmail = () => {
    navigator.clipboard.writeText("sravankumar0103@gmail.com");
    setCopied(true);
    toast({ title: "Email copied!", description: "Address copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
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
    <section id="contact" className="py-24 md:py-48 relative overflow-hidden">
      {/* Refined background elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/2 rounded-full blur-[100px] pointer-events-none" />

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
              <span className="inline-block text-[10px] font-sans text-primary uppercase tracking-[0.6em] mb-12 border-b border-primary/20 pb-2">
                Get In Touch
              </span>

              <h3 className="text-6xl md:text-8xl font-display font-medium text-foreground mb-12 tracking-tight leading-[0.95]">
                Let&apos;s build <br />
                <motion.span
                  className="gold-text italic"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  something
                </motion.span> <br />
                great.
              </h3>

              <p className="text-lg text-muted-foreground font-sans font-light mb-16 max-w-sm leading-relaxed opacity-80">
                I am currently open to new opportunities and interesting collaborations. Let’s create something impactful together.
              </p>

              <div className="space-y-8">
                <motion.div
                  className="group cursor-pointer inline-flex flex-col"
                  onClick={copyEmail}
                  whileHover={{ x: 5 }}
                >
                  <span className="text-[10px] font-sans text-muted-foreground uppercase tracking-[0.3em] mb-3 group-hover:text-primary transition-colors">
                    Direct Email
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-xl md:text-2xl font-sans text-foreground">
                      sravankumar0103@gmail.com
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-all duration-300">
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </div>
                  </div>
                </motion.div>

                <div className="flex gap-4 pt-6">
                  <SocialIcon href="https://github.com/sravankumar0103" icon={<Github className="w-5 h-5" />} />
                  <SocialIcon href="https://linkedin.com/in/diddi-sravan-kumar" icon={<Linkedin className="w-5 h-5" />} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Form Side (Right) */}
          <div className="lg:col-span-6 lg:ml-auto lg:pt-32">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="premium-card rounded-[2rem] p-6 md:p-8 relative max-w-md ml-auto"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
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
      </div>

      <footer className="mt-48 pb-12 border-t border-white/5 pt-12 text-center">
        <p className="text-[9px] font-sans text-muted-foreground uppercase tracking-[0.8em] opacity-40">
          © {new Date().getFullYear()} Diddi Sravan Kumar · Digital Portfolio
        </p>
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
