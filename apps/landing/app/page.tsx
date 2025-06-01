'use client';
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Globe, Menu, X, Star, Feather, Code, Shield, Smartphone, MessageCircle } from 'lucide-react'
import { GlowingEffect } from "@repo/ui/components/effects/glowing-effect";
import { AnimatedGroup } from '@repo/ui/components/effects/animated-group'
import DownloadButton from '@repo/ui/components/common/DownloadButton'
import { TextEffect } from '@repo/ui/components/effects/text-effect'
import { Footer } from '@repo/ui/components/common/footer-section'
import { fetchLatestGithubVersion } from '@repo/ui/lib/utils';
import { Button } from '@repo/ui/components/button'
import { cn } from '@repo/ui/lib/utils'

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

export default function Home() {
  const [latestTag, setLatestTag] = useState<string | null>(null);

  useEffect(() => {
    fetchLatestGithubVersion().then(tag => {
      if (tag) setLatestTag(tag);
    });
  }, []);

  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <section>
          <div className="relative pt-24 md:pt-36">
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      delayChildren: 1,
                    },
                  },
                },
                item: {
                  hidden: {
                    opacity: 0,
                    y: 20,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: 'spring',
                      bounce: 0.3,
                      duration: 2,
                    },
                  },
                },
              }}
              className="absolute inset-0 -z-20">
              <Image
                src="/light.png"
                alt="background"
                className="absolute left-1/2 top-56 -translate-x-1/2 -z-20 lg:top-32"
                width={1500}
                height={1500}
              />
            </AnimatedGroup>
            <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]" />
            <div className="mx-auto max-w-7xl px-6 relative z-[1]">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={transitionVariants}>
                  <Link
                    href="https://github.com/odest/JotPad/releases/latest"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                    <span className="text-foreground text-sm">
                      JotPad v{latestTag} Released
                    </span>
                    <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                    <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                      <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                      </div>
                    </div>
                  </Link>

                  <TextEffect
                    as="h1"
                    per="char"
                    preset="slide"
                    delay={0.2}
                    className="mt-8 max-w-4xl mx-auto text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem]">
                      Take Notes Like a Conversation
                  </TextEffect>

                  <TextEffect
                    as="p"
                    per="word"
                    preset="blur"
                    delay={0.3}
                    className="mx-auto mt-8 max-w-2xl text-balance text-lg">
                      JotPad is an open-source, cross-platform note-taking app that lets you message yourself—just like a chat. Capture ideas, organize thoughts, and access your notes anywhere: web, desktop, or mobile.
                  </TextEffect>
                </AnimatedGroup>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                      ...transitionVariants,
                  }}
                  className="mt-12 flex flex-col items-center justify-center gap-4 md:flex-row">
                  <DownloadButton />
                  <Link href="https://github.com/odest/JotPad" target="_blank" rel="noopener noreferrer">
                    <Button
                      size="lg"
                      className="gap-2 px-6 py-5 text-lg shadow-xl border-2 border-black dark:border-white bg-transparent text-black  dark:text-white hover:bg-black hover:dark:text-black hover:dark:bg-white hover:text-white hover:scale-105 hover:shadow-2xl transition-transform duration-200">
                        <Star className="w-5 h-5" /> Star on GitHub
                      </Button>
                  </Link>
                </AnimatedGroup>
              </div>
            </div>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}>
              <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                <div
                  aria-hidden
                  className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                />
                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                  <Image
                    className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
                    src="/screenshot_dark.png"
                    width={1920}
                    height={1050}
                    alt="app screen"
                  />
                  <Image
                    className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden"
                    src="/screenshot_light.png"
                    width={1920}
                    height={1050}
                    alt="app screen"
                  />
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
        <FeaturesSection />
        <Footer />
      </main>
    </>
  )
}

const menuItems = [
  { name: 'Features', href: '#features' },
  { name: 'Solution', href: '/' },
  { name: 'About', href: '/' },
]

const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <header>
      <nav
        data-state={menuState && 'active'}
        className="fixed z-20 w-full px-2 group">
        <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5')}>
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2">
                <Image src="/icon.png" alt="" width={32} height={32}/>
                <p className='text-xl'>JotPad</p>
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-accent-foreground block duration-150">
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150">
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button
                    asChild
                    size="sm">
                  <Link href="/app">
                    <Globe className="w-5 h-5" /> Launch Web App
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

const FeaturesSection = () => {
  return (
    <section id="features" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedGroup variants={transitionVariants}>
          <div className="text-center mb-16">
            <TextEffect
              as="h2"
              per="word"
              preset="slide"
              delay={0.1}
              className="text-4xl md:text-5xl lg:text-6xl mb-6">
              Why Choose JotPad?
            </TextEffect>
            <TextEffect
              as="p"
              per="word"
              preset="blur"
              delay={0.2}
              className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience note-taking reimagined. Simple, fast, and designed for the way you think.
            </TextEffect>
          </div>
        </AnimatedGroup>

        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.3,
                },
              },
            },
            ...transitionVariants,
          }}>

          <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
            <GridItem
              area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
              icon={<MessageCircle className="h-4 w-4 text-black dark:text-neutral-400" />}
              title="Chat-like Interface"
              description="Message yourself naturally. No complex interface—just type and go."
            />

            <GridItem
              area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
              icon={<Smartphone className="h-4 w-4 text-black dark:text-neutral-400" />}
              title="Cross-Platform"
              description="Access your notes seamlessly on web, desktop, and mobile."
            />

            <GridItem
              area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
              icon={<Shield className="h-4 w-4 text-black dark:text-neutral-400" />}
              title="Privacy First"
              description="Your notes, your data. Open source and transparent."
            />

            <GridItem
              area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
              icon={<Code className="h-4 w-4 text-black dark:text-neutral-400" />}
              title="Open Source"
              description="Built by developers for everyone. Contribute on GitHub."
            />

            <GridItem
              area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
              icon={<Feather className="h-4 w-4 text-black dark:text-neutral-400" />}
              title="Ultra Lightweight"
              description="Compact design ensures rapid setup and efficient operation."
            />
          </ul>
        </AnimatedGroup>
      </div>
    </section>
  )
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          blur={0}
          borderWidth={3}
          spread={80}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-600 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white">
                {title}
              </h3>
              <h2 className="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
