import type { ResourceCategory } from "./types";

const categories: ResourceCategory[] = [
    {
        "icon":  "fas fa-laptop-code",
        "title":  "Hands-on Practice \u0026 Labs",
        "cards":  [
                      {
                          "title":  "Interactive Learning Platforms",
                          "desc":  "The most popular gamified cybersecurity platforms",
                          "links":  [
                                        {
                                            "name":  "TryHackMe",
                                            "href":  "https://tryhackme.com/"
                                        },
                                        {
                                            "name":  "HackTheBox",
                                            "href":  "https://www.hackthebox.com/"
                                        }
                                    ]
                      },
                      {
                          "title":  "Classic Wargames",
                          "desc":  "The original and most popular security wargames",
                          "links":  [
                                        {
                                            "name":  "OverTheWire",
                                            "href":  "https://overthewire.org/wargames/"
                                        }
                                    ]
                      },
                      {
                          "title":  "Vulnerable Applications",
                          "desc":  "Most popular vulnerable VMs and web applications",
                          "links":  [
                                        {
                                            "name":  "VulnHub",
                                            "href":  "https://www.vulnhub.com/"
                                        },
                                        {
                                            "name":  "OWASP Top 10",
                                            "href":  "https://sourceforge.net/projects/owaspbwa/"
                                        },
                                        {
                                            "name":  "PentesterLab",
                                            "href":  "https://pentesterlab.com/exercises/web-for-pentester"
                                        },
                                        {
                                            "name":  "BWAPP",
                                            "href":  "http://www.itsecgames.com/"
                                        }
                                    ]
                      },
                      {
                          "title":  "Binary Exploitation",
                          "desc":  "Most popular binary exploitation challenges",
                          "links":  [
                                        {
                                            "name":  "pwnable.kr",
                                            "href":  "http://pwnable.kr/"
                                        }
                                    ]
                      }
                  ]
    },
    {
        "icon":  "fas fa-flag",
        "title":  "CTF Platforms \u0026 Challenges",
        "cards":  [
                      {
                          "title":  "Beginner-Friendly Platforms",
                          "desc":  "Start here for CTF competitions and events",
                          "links":  [
                                        {
                                            "name":  "PicoCTF",
                                            "href":  "https://picoctf.org/"
                                        },
                                        {
                                            "name":  "RootMe",
                                            "href":  "https://www.root-me.org/"
                                        },
                                        {
                                            "name":  "CTFtime",
                                            "href":  "https://ctftime.org/"
                                        }
                                    ]
                      },
                      {
                          "title":  "Major CTF Competitions",
                          "desc":  "Premier international CTF competitions",
                          "links":  [
                                        {
                                            "name":  "Google CTF",
                                            "href":  "https://capturetheflag.withgoogle.com/"
                                        },
                                        {
                                            "name":  "Meta CTF",
                                            "href":  "https://www.facebook.com/hackercup"
                                        },
                                        {
                                            "name":  "C2C CTF",
                                            "href":  "https://c2c-ctf-2025.org/"
                                        },
                                        {
                                            "name":  "Plaid CTF",
                                            "href":  "https://plaidctf.com/"
                                        }
                                    ]
                      },
                      {
                          "title":  "Specialized Platforms",
                          "desc":  "Topic-focused challenges",
                          "links":  [
                                        {
                                            "name":  "CryptoHack",
                                            "href":  "https://cryptohack.org/"
                                        },
                                        {
                                            "name":  "RingZer0",
                                            "href":  "https://ringzer0ctf.com/"
                                        },
                                        {
                                            "name":  "Hacker101",
                                            "href":  "https://ctf.hacker101.com/"
                                        },
                                        {
                                            "name":  "PortSwigger Academy",
                                            "href":  "https://portswigger.net/web-security"
                                        },
                                        {
                                            "name":  "HackXpert",
                                            "href":  "https://labs.hackxpert.com/"
                                        }
                                    ]
                      },
                      {
                          "title":  "CTF Resources \u0026 Learning",
                          "desc":  "Learning guides and seasonal challenges",
                          "links":  [
                                        {
                                            "name":  "CTF Handbook",
                                            "href":  "https://ctf101.org/"
                                        },
                                        {
                                            "name":  "CTF Field Guide",
                                            "href":  "https://trailofbits.github.io/ctf/"
                                        }
                                    ]
                      }
                  ]
    },
    {
        "icon":  "fas fa-hammer",
        "title":  "Essential CTF Tools",
        "cards":  [
                      {
                          "title":  "CyberChef",
                          "desc":  "All-in-one web tool for encryption, encoding, compression, and data analysis",
                          "links":  [
                                        {
                                            "name":  "CyberChef",
                                            "href":  "https://gchq.github.io/CyberChef/"
                                        }
                                    ]
                      },
                      {
                          "title":  "Reverse Engineering",
                          "desc":  "Essential reverse engineering tools",
                          "links":  [
                                        {
                                            "name":  "Ghidra",
                                            "href":  "https://ghidra-sre.org/"
                                        },
                                        {
                                            "name":  "IDA Free",
                                            "href":  "https://hex-rays.com/ida-free/"
                                        }
                                    ]
                      },
                      {
                          "title":  "Crypto \u0026 Hash Cracking",
                          "desc":  "Most popular crypto and hash tools",
                          "links":  [
                                        {
                                            "name":  "dCode",
                                            "href":  "https://www.dcode.fr/en"
                                        },
                                        {
                                            "name":  "CrackStation",
                                            "href":  "https://crackstation.net/"
                                        },
                                        {
                                            "name":  "Hashcat",
                                            "href":  "https://hashcat.net/hashcat/"
                                        }
                                    ]
                      },
                      {
                          "title":  "Web Exploitation",
                          "desc":  "Essential for web Analysis",
                          "links":  [
                                        {
                                            "name":  "Burp Suite",
                                            "href":  "https://portswigger.net/burp/"
                                        },
                                        {
                                            "name":  "SQLmap",
                                            "href":  "https://sqlmap.org/"
                                        }
                                    ]
                      },
                      {
                          "title":  "Binary Exploitation",
                          "desc":  "Most popular PWN framework for CTFs",
                          "links":  [
                                        {
                                            "name":  "pwntools",
                                            "href":  "https://docs.pwntools.com/"
                                        }
                                    ]
                      },
                      {
                          "title":  "Steganography",
                          "desc":  "Online steganography tools for hidden data analysis",
                          "links":  [
                                        {
                                            "name":  "Online Stego",
                                            "href":  "https://stylesuxx.github.io/steganography/"
                                        }
                                    ]
                      }
                  ]
    },
    {
        "icon":  "fas fa-tools",
        "title":  "General Security Tools",
        "cards":  [
                      {
                          "title":  "Hackers OS",
                          "desc":  "Popular penetration testing Linux distributions",
                          "links":  [
                                        {
                                            "name":  "Kali Linux",
                                            "href":  "https://www.kali.org/"
                                        },
                                        {
                                            "name":  "Parrot OS",
                                            "href":  "https://www.parrotsec.org/"
                                        }
                                    ]
                      },
                      {
                          "title":  "Network Analysis",
                          "desc":  "Essential network security tools",
                          "links":  [
                                        {
                                            "name":  "Wireshark",
                                            "href":  "https://www.wireshark.org/"
                                        },
                                        {
                                            "name":  "Nmap",
                                            "href":  "https://nmap.org/"
                                        }
                                    ]
                      },
                      {
                          "title":  "Web Security Testing",
                          "desc":  "Most popular web application scanners",
                          "links":  [
                                        {
                                            "name":  "Burp Suite",
                                            "href":  "https://portswigger.net/burp/communitydownload"
                                        },
                                        {
                                            "name":  "OWASP ZAP",
                                            "href":  "https://www.zaproxy.org/"
                                        }
                                    ]
                      },
                      {
                          "title":  "Penetration Testing Frameworks",
                          "desc":  "Popular exploitation and red team frameworks",
                          "links":  [
                                        {
                                            "name":  "Metasploit",
                                            "href":  "https://www.metasploit.com/"
                                        },
                                        {
                                            "name":  "Silver",
                                            "href":  "https://bishopfox.com/tools/sliver"
                                        },
                                        {
                                            "name":  "Cobalt Strike",
                                            "href":  "https://www.cobaltstrike.com/"
                                        },
                                        {
                                            "name":  "Havoc",
                                            "href":  "https://havocframework.com/"
                                        }
                                    ]
                      }
                  ]
    },
    {
        "icon":  "fas fa-book",
        "title":  "Documentation \u0026 Guides",
        "cards":  [
                      {
                          "title":  "Essential Security Standards",
                          "desc":  "Industry standard security guidelines and frameworks",
                          "links":  [
                                        {
                                            "name":  "OWASP Top 10",
                                            "href":  "https://owasp.org/www-project-top-ten/"
                                        },
                                        {
                                            "name":  "Rawsec\u0027s Inventory",
                                            "href":  "https://inventory.raw.pm/tools.html#title-tools-cracking"
                                        }
                                    ]
                      },
                      {
                          "title":  "Popular Security Platforms",
                          "desc":  "Leading security research and training platforms",
                          "links":  [
                                        {
                                            "name":  "HackerOne",
                                            "href":  "https://www.hackerone.com/hacktivity"
                                        },
                                        {
                                            "name":  "PortSwigger",
                                            "href":  "https://portswigger.net/research"
                                        },
                                        {
                                            "name":  "TCM Security",
                                            "href":  "https://tcm-sec.com/blog/"
                                        }
                                    ]
                      },
                      {
                          "title":  "Vulnerability Research",
                          "desc":  "Essential vulnerability and research resources",
                          "links":  [
                                        {
                                            "name":  "CVE Database",
                                            "href":  "https://cve.mitre.org/"
                                        },
                                        {
                                            "name":  "ExploitDB",
                                            "href":  "https://www.exploit-db.com/"
                                        },
                                        {
                                            "name":  "NIST",
                                            "href":  "https://nvd.nist.gov/vuln/search"
                                        },
                                        {
                                            "name":  "NIST",
                                            "href":  "https://nvd.nist.gov/vuln/search"
                                        }
                                    ]
                      },
                      {
                          "title":  "Security News",
                          "desc":  "Most trusted cybersecurity news sources",
                          "links":  [
                                        {
                                            "name":  "CISA",
                                            "href":  "https://www.cisa.gov/"
                                        },
                                        {
                                            "name":  "Krebs Security",
                                            "href":  "https://krebsonsecurity.com/"
                                        }
                                    ]
                      },
                      {
                          "title":  "GitHub Popular Documentation",
                          "desc":  "Most popular GitHub security resources",
                          "links":  [
                                        {
                                            "name":  "SecLists",
                                            "href":  "https://github.com/danielmiessler/SecLists"
                                        },
                                        {
                                            "name":  "PayloadsAllTheThings",
                                            "href":  "https://github.com/swisskyrepo/PayloadsAllTheThings"
                                        }
                                    ]
                      },
                      {
                          "title":  "Security Cheat Sheets \u0026 Guides",
                          "desc":  "Essential security reference guides",
                          "links":  [
                                        {
                                            "name":  "OWASP CheatSheets",
                                            "href":  "https://github.com/OWASP/CheatSheetSeries"
                                        },
                                        {
                                            "name":  "HackTricks",
                                            "href":  "https://github.com/carlospolop/hacktricks"
                                        },
                                        {
                                            "name":  "Hacker Recipes",
                                            "href":  "https://github.com/ShutdownRepo/The-Hacker-Recipes"
                                        }
                                    ]
                      },
                      {
                          "title":  "Linux Cheat Sheets \u0026 Guides",
                          "desc":  "Essential reference guides",
                          "links":  [
                                        {
                                            "name":  "Kali Linux",
                                            "href":  "https://www.kali.org/docs/general-use/"
                                        },
                                        {
                                            "name":  "ParrotSec OS",
                                            "href":  "https://parrotsec.org/docs/category/configuration"
                                        },
                                        {
                                            "name":  "GTFOBins",
                                            "href":  "https://gtfobins.github.io/"
                                        },
                                        {
                                            "name":  "Essential Commands",
                                            "href":  "https://www.hostinger.com/tutorials/linux-commands"
                                        }
                                    ]
                      }
                  ]
    },
    {
        "icon":  "fab fa-youtube",
        "title":  "Educational YouTube Channels",
        "cards":  [
                      {
                          "title":  "Network Security",
                          "desc":  "Most popular networking and security channels",
                          "links":  [
                                        {
                                            "name":  "NetworkChuck",
                                            "href":  "https://www.youtube.com/@NetworkChuck"
                                        },
                                        {
                                            "name":  "David Bombal",
                                            "href":  "https://www.youtube.com/@davidbombal"
                                        },
                                        {
                                            "name":  "PowerCert",
                                            "href":  "https://www.youtube.com/@PowerCertAnimatedVideos"
                                        }
                                    ]
                      },
                      {
                          "title":  "Linux \u0026 System Administration",
                          "desc":  "Essential Linux administration and security",
                          "links":  [
                                        {
                                            "name":  "NetworkChuck",
                                            "href":  "https://www.youtube.com/@NetworkChuck"
                                        },
                                        {
                                            "name":  "M Prashant",
                                            "href":  "https://www.youtube.com/@MPrashant"
                                        }
                                    ]
                      },
                      {
                          "title":  "Ethical Hacking \u0026 Penetration Testing",
                          "desc":  "Top ethical hacking channels",
                          "links":  [
                                        {
                                            "name":  "John Hammond",
                                            "href":  "https://www.youtube.com/@_JohnHammond"
                                        },
                                        {
                                            "name":  "The Cyber Mentor",
                                            "href":  "https://youtube.com/@tcmsecurityacademy?si=mMEpsb5Ukk7axqZDr"
                                        },
                                        {
                                            "name":  "HackerSploit",
                                            "href":  "https://www.youtube.com/@HackerSploit"
                                        },
                                        {
                                            "name":  "Red Team Village",
                                            "href":  "https://www.youtube.com/@RedTeamVillage"
                                        }
                                    ]
                      },
                      {
                          "title":  "Web Security \u0026 Bug Bounty",
                          "desc":  "Most popular web security and bug bounty channels",
                          "links":  [
                                        {
                                            "name":  "NahamSec",
                                            "href":  "https://www.youtube.com/@NahamSec"
                                        },
                                        {
                                            "name":  "STÃ–K",
                                            "href":  "https://www.youtube.com/@STOKfredrik"
                                        },
                                        {
                                            "name":  "InsiderPhD",
                                            "href":  "https://www.youtube.com/@InsiderPhD"
                                        },
                                        {
                                            "name":  "HackerOne",
                                            "href":  "https://www.youtube.com/@HackerOneTV"
                                        }
                                    ]
                      },
                      {
                          "title":  "Programming \u0026 Development",
                          "desc":  "Popular programming education channels",
                          "links":  [
                                        {
                                            "name":  "CodeWithHarry",
                                            "href":  "https://www.youtube.com/@CodeWithHarry"
                                        },
                                        {
                                            "name":  "Fireship",
                                            "href":  "https://www.youtube.com/@Fireship"
                                        },
                                        {
                                            "name":  "FreeCodeCamp",
                                            "href":  "https://www.youtube.com/@freecodecamp"
                                        },
                                        {
                                            "name":  "Bro Code",
                                            "href":  "https://www.youtube.com/@BroCodez"
                                        }
                                    ]
                      },
                      {
                          "title":  "CTF \u0026 Challenges",
                          "desc":  "CTF walkthroughs and challenges Walkthroughs",
                          "links":  [
                                        {
                                            "name":  "LiveOverflow",
                                            "href":  "https://www.youtube.com/@LiveOverflow"
                                        },
                                        {
                                            "name":  "IppSec",
                                            "href":  "https://www.youtube.com/@ippsec"
                                        },
                                        {
                                            "name":  "PwnFunction",
                                            "href":  "https://www.youtube.com/@PwnFunction"
                                        },
                                        {
                                            "name":  "PWN.College",
                                            "href":  "https://www.youtube.com/@pwncollege"
                                        }
                                    ]
                      },
                      {
                          "title":  "InfoSec \u0026 Tools Analysis",
                          "desc":  "Latest cybersecurity trends and analysis",
                          "links":  [
                                        {
                                            "name":  "Cyber News",
                                            "href":  "https://www.youtube.com/@CyberNews"
                                        },
                                        {
                                            "name":  "InfoSec Pat",
                                            "href":  "https://www.youtube.com/@InfoSecPat"
                                        },
                                        {
                                            "name":  "Privacy Matters",
                                            "href":  "https://www.youtube.com/@PrivacyMatters517"
                                        },
                                        {
                                            "name":  "CyberFlow",
                                            "href":  "https://www.youtube.com/@CyberFlow10"
                                        },
                                        {
                                            "name":  "Mad Hat",
                                            "href":  "https://www.youtube.com/@madhatistaken"
                                        },
                                        {
                                            "name":  "Bitten Tech",
                                            "href":  "https://www.youtube.com/@BittenTech"
                                        },
                                        {
                                            "name":  "Hacker Joe",
                                            "href":  "https://www.youtube.com/@HackerJohn"
                                        },
                                        {
                                            "name":  "Crypto NWO",
                                            "href":  "https://www.youtube.com/@CryptoNWO"
                                        },
                                        {
                                            "name":  "MAFH",
                                            "href":  "https://www.youtube.com/@MalwareAnalysisForHedgehogs"
                                        },
                                        {
                                            "name":  "WsCube CyberSec",
                                            "href":  "https://youtube.com/@wscubecybersecurity?si=u8aaSYDQ9eL4JcuJ"
                                        }
                                    ]
                      }
                  ]
    }
];

export default categories;
