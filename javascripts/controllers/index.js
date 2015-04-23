/*
  Begin Global Variables
*/

  // Data structure that holds transcriptions. Looks something like the following
  // [ {start: "0:00", end: "0:10", text:"Conditional variables are cool"}, ... ]
  var transcriptions = [];

  // Video anchor used to define when the current transcription segment started
  var anchor = "0:00";

  // Metrics object
  var metrics = {};

  // Global reference to the wavesurfer
  var globalSurfer;

  // Video state
  var videoPlaying = false;

  // Surfer state
  var surferPlaying = false;

  // Start time global reference
  var startTime;

/*
  End Global Variables
*/

$(document).ready(function () {
  setVideoFromUrl();
  begin();
  initializeMetricsBaseInformation();
});

/*
  Sets the correct video from url parameters
*/
function setVideoFromUrl() {
  var stackURL = document.URL.split("/");
  if (stackURL.length === 6) {
    var videoIndex = parseInt(stackURL[4]);
    $(".video-selector option").eq(videoIndex).attr('selected', true);
  }
}

/*
  Gets basic metrics information
*/
function initializeMetricsBaseInformation() {
  var stackURL = document.URL.split("/");
  if (stackURL.length === 6) {
    var user = stackURL.pop();
    metrics["name"] = user;
  }
}

/*
  Started once the DOM finishes loading
*/
function begin() {
  var videoIndex = parseInt($(".video-selector").val(), 10);

  initializeUI();
  initializeCompletely();
  loadVideo(videoIndex);
  bindEventListeners();
  bindVideoEvents();
}

/*
  Initialize the UI to default states
*/
function initializeUI() {
  $(".waveform-loading").removeClass("hidden");
  $(".submit").click(function () {
    var $that = $(this);
    $that.text("Submitting Transcription...");
    $.ajax({
      type: "POST",
      url: "/first",
      data: {
        stats: stats(),
        transcriptions: save()
      },
      success: function (data) {
        $that.text("Transcription Submitted!");
        $that.addClass("unclickable");
      }
    });
  });
}

/*
  Initialize completely auto complete plugin
*/
function initializeCompletely() {
  var input = document.getElementById('completely-input-container');

  var p = completely(input);

  p.onChange = function (text) {
    p.startFrom = text.lastIndexOf(' ')+1;
    p.repaint();
  };
  p.options = ["going","let's","actually","memory","about","right","pointer","that's","because","program","could","little","write","process","we'll","don't","inside","thread","we're","alright","other","which","we've","value","first","there","example","these","something","print","things","should","would","bytes","variable","here's","threads","thing","called","different","child","there's","system","where","array","might","mutex","you've","processes","return","space","those","you're","problem","happens","point","character","function","section","number","that","string","another","start","think","change","using","integer","parent","stuff","doesn't","buffer","until","address","before","happen","remember","critical","count","variables","check","course","signal","standard","hello","great","really","while","doing","error","better","calls","here","again","waiting","trying","what's","malloc","you'll","enough","structure","can't","writing","condition","continue","finished","around","instead","didn't","wanted","still","stack","never","three","result","means","sleep","being","running","finish","programs","anything","pointers","their","after","this","question","output","gonna","second","today","moment","questions","solution","operating","okay","maybe","values","words","pizza","characters","unlock","people","world","works","perhaps","later","nothing","someone","already","looking","fork()","working","least","guess","malloc()","simple","always","through","written","useful","they're","contents","arguments","saying","pretty","reading","create","multiple","lecture","correct","returns","scanf","valid","shell","store","seconds","whole","source","counting","calling","linked","block","execute","pointing","imagine","every","actual","numbers","information","finally","progress","programming","alarm","discover","quite","directory","times","allocate","machine","single","access","itself","well","immediately","beginning","what","getline","large","wrong","stuck","possible","current","version","twice","either","rather","between","suppose","though","descriptor","common","order","semaphore","along","flags","answer","talking","thank","happened","printf","virtual","increment","whatever","terms","library","look","prints","probably","control","compile","code","neighbor","work","struct","cannot","takes","comes","sorry","particular","method","exactly","time","points","initialize","entry","hundred","everything","longer","signals","makes","environment","hardware","expect","fantastic","won't","anymore","simply","implement","mutual","you'd","anytime","future","tries","compiler","quick","exclusion","failed","readers","raised","notice","location","pthread","global","forever","functions","haven't","eventually","managed","eight","argument","include","raise","unlocked","update","gives","strings","piece","original","worry","printing","please","children","isn't","handler","crash","waitpid","spaces","message","having","reason","however","stored","given","knows","pattern","whether","looks","amount","locks","enter","complicated","locked","sizeof","currently","wrote","greater","equal","lower","created","welcome","completely","secret","couple","random","allocated","directly","slice","efficient","broken","automatic","worst","following","basic","exited","sleeping","command","state","printed","class","correctly","hey","level","everybody","attempt","remain","whoops","thinking","writer","turns","started","files","larger","structures","extra","typedef","systems","decide","close","input","strcat","semaphores","copying","errors","figure","careful","sigint","pages","them","morning","exist","zero","terminal","default","background","followed","expression","playing","parts","calloc","static","newline","starts","algorithm","lifetime","often","posix","yeah","fragmentation","equals","creating","finishes","lowest","complete","[something]","interrupt","ampersand","printf()","minutes","whilst","status","blocks","making","good","instructions","pthread_create","solutions","problems","allowed","press","important","talked","letters","writers","track","hopefully","arbitrary","changed","meditating","anybody","carry","done","copied","byte","integers","realloc","fails","needs","early","wants","basically","chance","bounded","ready","clock","agree","strcpy","video","somewhere","constants","reader","arrays","prove","examples","sense","break","cs241","exciting","previous","returned","follow","allocations","constant","changing","macro","defined","destroy","score","lines","special","additional","slices","options","includes","forgot","secondly","brain","bathroom","bigger","small","delete","else","freed","assume","debug","gotcha","negative","initialized","android","assert","practice","object","person","choose","non-zero","executing","straight","write()","sem_wait()","allows","allocation","interrupts","round","pthread_join","quickly","perfect","kernel","checking","decrement","declared","magic","sem_wait","except","define","dereference","format","twenty","macros","shouldn't","forget","underscore","open()","asterisk","entries","request","resource","front","found","certainly","place","overflow","choice","likely","security","question]","outside","definition","kinds","fault","coming","parse","sending","language","it'll","afterwards","capacity","represent","friday","wonderful","oops","allocator","zombie","zombies","powerful","thirty","decides","wait","[silence]","storage","file","places","sixteen","meditate","/bin/ls","stream","messages","slightly","declare","putting","initially","exec()","pthread_mutex_lock","understand","addresses","otherwise","thats","reuse","[student","keeps","reads","identifier","coffee","thanks","commands","infinite","performance","anyone","getlast()","getting","taking","remaining","assembly","incredibly","decided","together","segfault","surprising","returning","sscanf","seven","would've","waitpid()","tried","behind","back","empty","incremented","across","destination","resources","wouldn't","essentially","play","ctrl-c","others","faster","turn","asking","trick","interesting","logtxt","peterson's","pthread_exit","giving","sounds","without","almost","difference","monks","asked","solve","streams","sleeps","appear","links","seems","types","underneath","appears","deadlock","double","pause","behavior","accidentally","largest","one","flush","how's","matter","million","clean","bring","unsigned","normally","descriptors","published","avoid","gotchas","thinks","pieces","unable","easy","dangerous","similar","become","separate","split","suddenly","during","usually","heap","automatically","incrementing","loops","warning","purpose","what've","money","debugging","wednesday","environ","release","sigalarm","does","loop","nevermind","parameters","certain","available","pause]","strlen","strlen()","pointed","they've","closed","where's","signature","knowledge","have","one's","billion","minus","unless","allow","designed","invalid","efficiently","programmer","couldn't","stdin","carefully","tells","leave","compiles","impossible","holes","easier","'okay","opened","compiled","they'll","convert","synchronization","possibly","starting","exists","cancel","potential","preprocessor","bitwise","reduce","false","pseudocode","outputtxt","sixteenth","peterson","display","meaning","putchar","treated","thumbs","compiling","parameter","short","mistakes","results","interview","anyways","(which","stacks","intent","advanced","terminate","candidate","woken","cache","sleep()","occasionally","taken","demo","segmentation","surprise","especially","fail","several","sigterm","[long","promise","signed","overwritten","support","with","precise","required","then","presumably","beforehand","clone","mention","mistake","signal()","architecture","manual","walking","keeping","accident","pushdata","programmers","register","worlds","years","touching","garbage","happening","thought","gone","linux","fortunately","instruction","treat","arrived","barrier","sometimes","unfortunately","properties","chdir","needed","void*","process'","turning","clever","next","explicitly","parenthesis","sbrk()","typed","necessary","logic","reader-writer","need","handout","lock","software","review","amazing","minute","could've","speed","anyway","broadcast","represents","table","manpage","make","exchange","worked","handle","evaluate","#include","wasn't","setting","therefore","ensure","who's","fifty","chunks","satisfy","giant","down","pthread_join()","generate","python","shown","etcetera","fprintf","overhead","challenge","fgets","sizes","disappear","unused","typical","panic","free()","twelve","copies","stand","truncate","keyboard","kinda","sem_post","trust","included","general","grabs","provided","terminated","equivalent","fscanf","robust","freeing","fopen","null","alias","sigalrm","dealing","cloned","temporary","overwrite","meanwhile","forks","reasonable","readable","ctime()","hours","semester","requests","explain","connected","knowing","aren't","changes","becomes","lives","myself","ignore","simpler","bother","sections","recursive","scope","major","finds","comment","free","fixed","strange","local","issue","malloc'd","incorrect","platform","yours","trivial","holding","buffering","buffers","particularly","environmental","flushed","stopped","cpu's","noticed","reference","keyword","ecetera","week","slash","harder","assert()","converted","ascii","kills","heard","assumes","differences","woohoo","depends","entered","hooray","third","versions","passed","showed","reached","clear","modify","volunteer","guarantee","monday","neurons","ourselves","clearly","silly","killed","statement","contiguous","image","primitives","implementation","provides","provide","sorting","badum","assign","somebody","ultimate","modern","much","milliseconds","further","stop","everyone","somehow","explicit","corresponds","tablet","share","users","spend","based","typically","testing","believe","kilobyte","shuffle","smaller","obvious","specification","stick","slower","medium-sized","analogy","mapping","tends","adding","physical","initial","hi","scheduler","pthread_exit()","updating","accessing","syntax","throw","append","happy","true","queue","definitions","apple","argue","shared","golden","chalice","flag","dekker's","calculating","learn","monk","type","cond_wait","exclusive","unlocks","calculation","existing","declaration","hasn't","confuse","hahaha","detect","names","subtract","exercise","excluding","semicolon","watch","minecraft","defensive","slowly","programc","apart","search","extremely","sorts","exams","interviews","locations","getenv","reduced","final","switch","thousand","items","demonstration","internally","purposes","miracle","principle","mathematical","tricks","reused","free'd","continuing","now's","lucky","parents","'hi'","anywhere","attempts","crazy","asterisks","hexadecimal","drive","element","walks","/usr/include","zeroed","grouchy","square","memory'","deliberately","confident","continued","perror","introduce","representation","lists","4chan","tricky","specifiers","everywhere","starters","exits","wakes","scheduling","notes","percent","paused","week's","assignment","nobody","cares","strdup","prevent","situation","server","worried","fake","classic","worse","scattered","executes","ended","closing","partly","holds","protect","kill()","stands","ctrl+c","crashes","sigaction()","ability","stdio","machines","communicate","assumption","exception","effect","since","reminder","portable","attention","casting","potentially","gotten","life","videos","you","internal","broke","forty","32-bit","colon","phone","backwards","fgets()","exit()","identifiers","scared","standards","design","padded","fairness","dynamic","burning","valuable","competition","stdout","placement","strategies","similarly","students","successfully","truly","providing","advantages","disadvantages","allocating","operation","attacking","link_t","whats","expected","conditions","terse","fildes","sneaky","wanna","asynchronously","should've","sixty","ideas","power","device","attributes","scary","courses","pthread_cancel","secretly","formatting","cancelled","kitchen","read","extern","older","laptop","stdlibh","countgold","mine","getchar","touch","locking","unlocking","counter","twiddle","pthread_mutex","install","open","discovered","dreadlocks","understanding","undefined","turned","brand","accept","demos","usual","considered","sem_post()","proceed","length","relatively","digits","pirates","[pause]","proposed","brains","lowered","replace","asserts","standoff","dangling","build","living","finite","execution","analyze","dekker","console","cream","identified","currenttime","spell","truth","meditative","bervandes","symbol","ding","recognize","stale","unlock()","bells","window","cond_signal","expensive","excuse","data","unistdh","farpar","conditional","waking","matrix","know","escape","intended","fine","towards","sort","weird","floats","ninth","else'","beautiful","begin","annoying","[students","typedefs","commonly","painful","list","internet","'this","ladies","gentlemen","123456","throughout","diferent","compilers","collect","shorter","angrave","sitting","inherit","fork","getppid","waits","generally","loaded","runtime","get's","introduction","finishing","against","wexitstatus","relevant","connect","parallel","alive","getpid","addressable","moving","temporarily","sound","previously","direction","duplicate","classically","long-running","wait()","nearly","surely","doppleganger","weekend","processor","methods","cells","news","preserve","promises","cleared","movies","cleaning","computation","like","personally","independently","homework","collecting","call","unnecessary","promised","enable","fprintf()","pstree","timer","sandbox","limitsh","recursion","weight","editor","useless","singal","deeper","sigaction","manipulate","telling","defining","agentsmith","busy","agent","smith","delivered","forwards","specify","carefree","yourself","handlers","content","lectures","superuser","developed","interface","addition","fashion","continues","deliver","idiomatic","disappears","require","/program","option","disk","i've","simplest","suffers","dokie","google","test","simulation","cs225","terrible","skills","asserth","experiment","java","complaining","assumptions","recently","thumbnails","material","exported","targets","cores","aborts","checked","edited","tested","'look","'child","directories","realize","positive","argv[0]","forking","system's","under","target","determine","shells","fundamentally","supplied","continually","pressed","implementing","attempting","fixing","index","opposed","hurray","supply","safer","disappeared","memset","implicit","browser","interfaces","network","theres","night","incomplete","malfunctioning","including","group","splits","topic","easiest","decisions","upfront","themselves","higher","memory's","perror()","seats","fast","alternative","articles","i'll","fragmented","spare","practices","more","maximum","strncat","serving","specified","worth","unlike","segment","arbitrarily","outputtext","mutable","name","appending","obviously","filling","stat","recover","coalesce","areas","here:","bombs","into","ideal","amounts","commented","guaranteed","weren't","puzzle","memories","jello","smiley","from","picture","'hello'","space'","sides","reused'","pointer'","libraries","concerned","start'","merely","arithmetic","added","zeroes","operator","properly","management","fundamental","else's","complain","(this","model","extract","white","student","pthreads","popular","pthread_t","succeeded","tools","routine","beans","out","(void","o'clock","shpar","earlier","above","website","executed","claiming","numread","assembler","boyfriend","girlfriend","mentioned","experience","disarray","mess","associated","reach","necessarily","human","please_stop","(waiting)","insert","_killer_monsters_take_over_the_world","confusing","kitchens","precisely","suggested","advice","waited","permissions","permission","sum++","atomic","tempted","patterns","time'","nanoseconds","missing","implicitly","jealous","cover","user's","mode_t","illinois","known","o_creat","correspond","pthread_mutex_t","pthread_mutex_lock()","forgotten","pthread_mutex_init","conceptually","stepping","analysis","heres","absolutely","answer:","speak","passing","password","(come","apply","whenever","released","hapen","back)","appropriate","doens't","climbing","deals","slide","hints","mutexes","give","figured","thursday","details","covered","forty-two","suspended","animation","warnings","counters","fourth","remove","posted","suffer","simplify","corruption","multi-threaded","readline","manage","restart","audience","sufficient","copy","literature","convention","depending","[laughter]","faculty","assuming","sequence","mexican","sizeof()","generator","size","style","touched","shifting","signify","linkedlist","littered","algorithms","senior","neither","spotting","concurrency","non-null","catch","prior","claimed","tests","redirect","signaling","wished","solved","letter","today's","desired","reserved","exchanges","cellphone","simmer","duplicating","aside","ahead","terminating","sure","student)","compare","nothankyou","carries","manipulating","cake","wisconsin","tersely","nonzero","ensures","party","currenttime()","develop","boolean","fourty","asleep","backslash","meditation","subtle","steps","relock","page","bothers","eleven","cheese","conference","project","immediate","cheap","'count'","fifteen","prepared","sheep","ways","usr/include","/usr/include/","friend","production","implemented","force","reboot","allowing","total","bright","brackets","she's","typing","representing","opposite","calculatingok","meeting","invented","allocates","still)","longer)","frees","mydata","presented","lonely","theory","proudly","limitations","sleep's","relies","delegating","wrods","racked","data's","serious","nine","12345678","inherits","rand","reserves","vulnerable","zerowhat","anybody'","application","mortem","nearby","reserving","removed","quit'","byeee","unknown","whistle","pocket","characters)","everytime","'right","wherever","poem_s","interacting","/usr/include/stdlibh","bothering","prefer","poemptr","responsibility","char_bits","echos","structs","<gibberish>","opportunity","gravestone","postmortem","noteworthy","distinction","lived","secrets","destroyed","re-parented","ppid()","explode","printf'","existed","booted","undeclared","initiate","various","orphans","reparented","init","bufferings","webserver","wheeeeee","serve","parlance","cleans","scenario","creates","export","lying","heads","shortly","publishing","two-fold","bits","installed","laptops","board","ndk/sdk","buffered","<stringh> let's","learning","enjoy","pressing","impact","shop","32767","enrolled","assembled","mouth","again:","<stdlibh>","exclamation","midterm","program's","32768","icard","pencil","game","basics","interpret","bound","exiting","recommended","zombie's","interrupted","outlives","dies","long","died","exec","abcdabcdabcd","webpage","client","brought","#endif","directives","superbowl","range","sfprintf","assemble","believes","kansas","remembers","states","(well","everything)","asymmetric","combine","chemistry","(application","parent's","thissee","surpise","roughly","said:","reparent","care","once","significantly","abuffer","beings","setvbuff","callling","forked","funnest","unitstdh","buffers'","interface)","wheter","beyond","choosed","iterms","puts()","perforance","somewhat","sorted","orignal","seventy","involved","hierarchal","everybodys","int_max","anybodys","introductory","happened:","onenext","executing'","int_min","plugged","scoping","evern","differnt","'send","singal'","nanosecond","lstat","falling","overflowed","klled","didnt'","wonder","vocabulary","prepended","toward","identical","expectation","someones","begins","immdiately","cheated","callback","sayfork","supported","(*sighandler_t)(int)","sighandler","203","unpacking","middle","(between","parenthesis)","minimums","specifies","noway","void","nineteen","crashed","while(1)","refusing","ahhh","bundled","ctrl-\\","ctrl-z","onevalue","killing","running)","sigkill","mainframes","strlen(mesg)","sigchild","looping","spelled","days","notified","bomb","specifically","single-file","logged","luck","citizens","explanation","lectures'","delivers","programmatically","registers","sudden","free(ptr2)","thirteenth","root's","extended","finished'","processing'","identifer","ister","sigusr1","sigusr2","symbols","varies","official","history","idiom","seconds'","reaches","evilist","seen","alarms","thanks()","zeros","truncated","<pause>","result'","procrastinating","comon","embedded","anyone's","refer","evalutated","meaningless","please'","reserve","overrun","unusual","while()","terminates","definitely","if-expression","minority","definedwhoops","free(ptr1)","(think","envelope)","whoever","'ab'","following:","bytes:","bottom","processes's","contained","uvw","sizeof(char)","things:","today:","[insert","architectures","football","here]","baaad","okayfineehhhmiddle","blehh","baaaaad","wikibook","tomorrow's","commit","enjoyed","subversion","quits","recorded","goodbye","cs125","link","training","wheels","configure","tough","expert","searches","hacker","unbreak","plugging","driver","reread","missed","entirely","engineer","skill","tenacity","damnite","stubborn","undersore","expanded","noticing","proces","non-numbers","breaking","aggressive","executeand","sophistication","movie","41424344","images","therelet's","responsible","formats","produced","newer","helps","exist)","transcoding","records","cool","crashing","ancestry","(apart","fork)","futures","histories","importantly","quotes","case","cryptic","wondering","(just","page)","activation","alarm()","registering","wifexit","amoment","man","wifsignaled","wsigterm","-termsig","helpful","shall","messed","'hello","world'","remembered","clock'","invited","parties","expands","assertion","'segfault","program'","dont'","3<7*0","argv[1]","shows","generates","controller","'ahaha","behaving","development","again'","pulled","assemlby","satemetns","possibilites","mistake:","menacing","/usr/bin","fakes","router","boxes","utterly","requiring","argc","assures","filetxt","includeasserth","impress","modified","intend","printfs","avoids","sprintf","action","snprintf","edge","cat's","technique","conclude","lefthand","identify","specific","sulking","args[0]","args","entrance","<rand","chars>","tenacious","sooner","cause","execvp()","respond","strcpy()","excludes","buffer[len]","well-behaved","popcorn","informationâ all","replacing","buffer[len","zero-th","processes'","replaced","basis","readonly","filec","suggestion:","here)","occurance","overran","committees","formalize","guard","stormunds","sytem","utilites","describes","arguments)","abstraction","exact","flash","plus","here'","blanket","teddy","(what","spotted","features","insulation","fortuitous","protection","termination","universes","dfiferent","unreadable","corrupted","processs","super","blah","debated","consider","tomorrow","computing","proper","mallocing","allocation;","doubles","driving","getpid()","recurse","move","robot","born","memory:","'new'","'delete'","'typically'","optimizations","optimize","all","new/delete","yes","c-library","flying","plane","four","bloodstream","knapsack","malloc()s","free()s","non-trivial","computationally","arrange","horrendous","*picture","problems*","visual","works:","saves","indicate","poitners","book-keeping","used","choice:","reinforce","spot","malloc(2","kb)","find","happen:","systematic","read/write","sophisticated","comparison","rabbit","stackwhere's","live","watermark","threshold)","variables:","room","bytes)","re-using","passengers","boat","bus","unoccupied","inefficient","exhaust","stage","suitable","week)","arrrrrayyy","there'll","neighbor's","easy:","limit","coping","diagram","shuffling","area","'null","java's","bounjour","capture","occurred","intermediate","pointer)","bunch","mechanism","fragmentation's","hexdecimal","relationship","adopted","assignments","logging","earliest","(bonjour)","bonjour","contrary","what:","doppelganger","part","physicist","sufficiently","searching","(from","names)","descriptor)","w-o-r-l-d","theorem","spaces)","*nothing","here*","*again","discussion","accurate","sheet*","price","are","choices","tie-up","scrappy-doo","fits","mechanics","easily","slides","typos","comparisons","respects","fingers","proccesses'","goes","uses","destroying","longer-running","eaten","var2","confidently","hesitate","attacked","nibbling","jigsaw","tutorials","caching","issues","question's","hold","ary+3","4-byte","realistic","winded","malloc-ing","kilobytes","difficult","variant","challenges","disjoint","regions","seperate","drawing","freed'","garbled","list'","(let's","'i've","face","someone's","area'","advert","coalescing","_gnu_source","obliterated","inefficiently","'oooooh","address)","that'd","slow","hellos","correctly'","'world:-)'","120'","caller","newly","bytes'","next)","wheeeee","program:","wanted'","mental","hiding","(when","sneakier","doubly","storing","(pointers)","presenting","passage","fuzzled","meno","arithmatic","sticker","subtracting","bites","quizzes","overwrites","is","programmed","whati","supposed","extend","someting","elements","multiply","fastest","11:50","answered","incase","setup","inspiration","miners","canary","canaries","poison","gasses","singing","overloading","hexidecimal","deadbeef","deadcode","verify","sheet","begging","endpoints","override","donald","knuth","stdioh","virtualized","connection","sees","essence","spcae","7fffffff","likes","converting","bananas","downside","drive]","16gb","additions","recreate","intercept","conjuring","novice","<stdioh>","effectively","beginnings","displayed","coolest","hacks","heaps","seventeen","introduced","modal","agian","function;","shorter)","shrink","it's","registered","username","limited","threaded","parsed","kaboom","'malloc'","quicksand","one-seven","vertex","[stack]","fuctionality","[another","'alright","supposing","possibility","hitting","c'mon","framework","congratulations","whitespace","plan:","cycles","close()","integer'","seating","parser","unencrypt","ahhhhh","this:","play:","arguement","what'","line","childid","tell","eating","12345","0xdeadcode","choked","punk","celebrating","proud","maintain","sloppy","yesterday","coding","announce","email","midnight","fresh","picked","favorite","advances","huge","massive","tiny","position","link's","printf's","accidently","subtly","floating","size_t","cooking","storm","activity","variable)","async","lulls","cleaned","f1f1","discovering","prime","bitcoins","currency","cs241coins","intensive","awake","opens","funct","nasty","compute","syntactically","humans","consuming","(please_stop)","variablethere","made","feint","pthread_id","(grumbling)","yay","noises)","constantly","hearted","exit","smallest","spent","description","leaving","thread's","exitvalue","stderr","f2ok","funciton","awful","otherwords","duration","gotta","ahave","chefs","employed","waltz","commment","scheduled","theyre","coudl","safetly","absolute","shouldnt","kidding","interested","spoken","[background","noise]","bountiful","giver","codes","interpretter","potent","langauge","tremendous","countgold()","overwriting","saved","arlight","attitude","navigate","paste","joined","milliion","pyrax","nowhere","enumerate","asteric","gorillas","walked","meant","threw","preferences","coppied","boring","competing","stringh","owner","cirtical","inconsistent","exaple","reperesnet","consistent","sentinal","present","watching","objects","declares","private","fairly","objective","usage","procise","zeroth","reload","outburst","afterwords"," each","wrapped","malloc's","clerk","(student:","twiddiling","okay)","mostly","want","in-class","pthread_mutex_unlock()","append()","magnitute","[laughs]","appeared","lulling","magnitude","exam/quiz","unlucky","doubling","attribrutes","pthread_mutex_initializer","cense","untiil","serialize","similariliy","tuesday","ctime","'yeah","code'","wait'","magically","change()","eventaully","conflict","unlikley","entire","secondssince1970","disorganized","weant","parallelism","chosen","they'd","updateding","desperately","unallocated","stable","technically","goodhair","mutex'","proceeds","ain't","stalls","soemthing","sherlock","holmes","spinning","fight","cases","parallesism","resume","spawning","wanting","showing","me","numberokay","elusive","tying","filename","pthread_mutex_destroy()","head","analaogy","halloc","'that","unlocked'","becasue","slows","does:","facebook","tinder","profile","primatives","safeguards","nostalgia","'excuse","array'","politely","almost-exact","scanned","[byte]","maintenance","reiterate","tables","todays","primitive","1995","lowercase","volunteers","constrictive","applause","[clapping]","stops","behaves","amazingly","script","ground","filestream","python's","slice'","status)","srand()","swear","freeze","conscious","now'","much'","mark","components","intial","decrementing","cheat","actuall","administrator","left'","time_t","stole","[nothing]","contain","dependant","longest","occasion","surgeon","priority","non-surgeon","priorities","controls","hungry","semphore","hadn't","versatile","entering","statistical","powers","astericks","queues","classes","ii'll","longer'","processing","pipes","generating","computational","structure's","retrieved","sempahores","rand()","intern","sem_init()","carrying","represented","within","structrues","-pthread","aout","caused","generators","edition","according","siebel","played","messing","dollar","protecting","indentical","brother","connections","upgrade","sister","critically","corrupt","historic","genetic","talks","abstract","gorilla","errors)","vulnerability","historically","predict","case)","tempting","blank","friends","uhhhhhhh","asymmetry","guided","persuade","non-c","flipped","others'","deadlocked","british","duplicates","considering","generalizing","assumed","manuals","satisfied","desirable","stderrfileno","doubt","bathoom","chain","stdout_fileno","technical","kindly","loose","(cut's","associative","modifying","(speaking","jumps","paying","concrete","formal","solving","judge","success","(still","repeat","sometime","giggles","challenged","member","assistant","speaking","professor","while(p)","specifics","fascinating","booleans","built","handled","analyzing","beggining","that'll","closer","wooohooo","wooo","millisecond","[something","there]","[noise]","passes","excited","bracket","ignored","instance","reviewed","papers","conferences","journals","forward","mhmm","ignores","seriously","where'd","go","trump","trumps","timeh","namely","rough","lib","decades","article","andlib","1960s","tongue","retrieve","correct)","thirdly","strictly","chant","transcendental","tibet","bells]","requirements","threads)","unfair","jumping","appends","drill","non-negative","regular","processors","test&set","polite","swaps","part:","atomically","guerilla","lastly","microphone","completes","logical","step","officially","catered","compete","relative","beginners","passion","thenit","scrumple","paper","abcde","chrdir","communication","discussed","loop)","piazza","cluttered","casts","acident","spurious","forcing","#define","purchase","curved","decision","stuff)","deferred","raising","standing","saying:","selfish","toddler","cured","raises","modifications","accent","and","bully","sequences","waving","insight","seeing","minor","documentation","generalize","morning's","11:25","learned","proved","hadware","abide","casted","distant","notify","propogated","intents","encrypt","fully","completed","dekkers","silently","bothered","leaves","workstation","quietly","initialization","executable","uninvite","counts","link_create","datastructure","(eof)","plan","battery","milliamps","milliamperes","pthread's","endeavor","conpletely","halfway","becoming","lock()","looked","freddy","mercury","wahahaha","me-di-tate","restful","peaceful","delete()","fallen","exec/ls","kicking","oh","feeling","violent","that'e","biggest","moment's","owning","push","unwanted","comments","derailing","duplication","failed:","kick","ring","nutshell","monk's","afternoon","pthread_cond","describe","pthread_cond_wait","ending","wins","forced","post","everyone's","pthread_cond_signal","reasoning","apparently","confused","delta","charge","dollars","vulture","companies","improve","discussing]","educational","technologies","captain's","improvements","projects","subtitles","captions","crowdsourcing","nontrivial","perfectly","elevator","story","bin/ls","for-loop","twelfth","chunk","listing","(void*)","unique","lookups","hoops","redirected","schedule","stolen","query","named","quiet","padlock","wohahahahaha","laugh","wohaahaha","context","fifth","wohahahah","continuously","pthread_condition_wait","meditates","chillax","arrive","significant","arrives","balance","encourage","pthread_condition_signal","pasting","shouting","pthread_condition_broadcast","literal","office","acquire","paradigm","performant","fourteen","pthread_cond_t","pthread_cond_init","cesspool","crops","database","universe","manually","surgeons","cardiac","badly","custom","internship","producer","consumer","producer-consumer","p_threads","p_thread","64-bit","versus","insufficient","artibrary","inspired","expectations","smells","matched","clue:","grading","stages","ptr1","read/written","stone","greaters","zero)","weprobably","pthread_cond_broadcast","invariant","p_cond_signal","abotu","decremented","heading","barge","free(null)","succeeds","multithreaded","accesses","boundary","buddy","strongly","contest","quicker","scanning","contains","calloc()","california","robin","slot","variacle","hands","taught","andriod","ssize_t","brilliant","coursera","partners","december"];
}

/*
  Binds event listeners on input elements
*/
function bindEventListeners() {
  $(".video-selector").off().change(begin);
  $(".playback-selector").off().change(changePlaybackSpeed);
  $(".transcription-input-main").off().keypress(inputKeypress);
  $(".consent-agree").click(function () {
    $(".consent-container").remove();
    $(".transcription-input-main").focus();
  });
}

/*
  Binds event listeners on the video
*/
function bindVideoEvents() {
  var video = $(".main-video").get(0);

  var lastUpdate = 0;
  video.ontimeupdate = function () {
    var globalSurferTime = globalSurfer.getCurrentTime();
    var videoCurrentTime = video.currentTime;
    if (Math.abs(globalSurferTime - videoCurrentTime) > 0.1) {
      globalSurfer.skip(videoCurrentTime - globalSurferTime);
    }

    if (videoPlaying && !surferPlaying) {
      globalSurfer.play();
    }

    if (Math.abs(lastUpdate - videoCurrentTime) > 9 || lastUpdate > videoCurrentTime) {
      var scrollLeft = videoCurrentTime * 64;
      $(".waveform-container").animate({scrollLeft: scrollLeft}, 500);
      lastUpdate = videoCurrentTime;
    }
  };

  video.onended = function(e) {
    calculateTotalTime();
  };

  video.addEventListener("loadedmetadata", function () {
    changePlaybackSpeed();
    loadWaveform(function () {
      video.onplay = function () {
        videoPlaying = true;
        globalSurfer.play();
      };
      video.onpause = function () {
        videoPlaying = false;
        globalSurfer.pause();
      };
    });
  });
}

/*
  Changes the playback speed
*/
function changePlaybackSpeed() {
  var playbackRate = parseFloat($(".playback-selector").val());
  $(".main-video").get(0).playbackRate = playbackRate;
  loadWaveform($.noop);
}

/*
  Captures the input keypresses and reacts accordingly
*/
function inputKeypress(e) {
  $(".transcription-input-main").scrollLeft(0);
  if (e.which === 13) {
    solidifyTranscription(e);
  } else if (e.which === 96) {
    e.preventDefault();
    incrementMetricCount("rewindTwoSeconds");
    rewindTwoSeconds();
  } else if (e.which === 126) {
    e.preventDefault();
    incrementMetricCount("toggleVideo");
    toggleVideo();
  }

  if (!startTime) {
    startTime = new Date();
  }

  $(".transcription-input-main").blur(function () {
    $(".transcription-input").eq(0).val("");
  });
}

/*
  Rewind the video 5 seconds
*/
function rewindTwoSeconds() {
  var video = $(".main-video").get(0);
  video.currentTime = video.currentTime - 2;
}

/*
  Changes the video play/pause
*/
function toggleVideo() {
  var video = $(".main-video").get(0);
  if (video.paused === false) {
      video.pause();
  } else {
      video.play();
  }
}

/*
  Detects enter key and solidifies transcription in the event of an enter key
*/
function solidifyTranscription(e) {
  var transcriptionSegmentText = $(".transcription-input-main").val();
  var currentTime = getCurrentTime();

  var transcriptionSegment = {
    start: anchor,
    end: currentTime,
    text: transcriptionSegmentText
  };

  transcriptions.push(transcriptionSegment);

  anchor = currentTime;

  var transcriptionSegmentTemplate = $('<div class="transcription-segment"></div>');
  transcriptionSegmentTemplate.text(transcriptionSegment.start + " - " + transcriptionSegment.end + " : " + transcriptionSegment.text);

  $(".transcription-container").prepend(transcriptionSegmentTemplate);
  $(".transcription-input-main").val("");
}

/*
  Returns the current time nicely formatted
*/
function getCurrentTime() {
  var currentTime = $(".main-video").get(0).currentTime;

  var currentTimeInMinutes = Math.floor(currentTime / 60);
  var currentTimeInSeconds = Math.floor(currentTime % 60);

  if (currentTimeInSeconds < 10) {
    return currentTimeInMinutes + ":0" + currentTimeInSeconds;
  }
  return currentTimeInMinutes + ":" + currentTimeInSeconds;
}

/*
  Load the waveform for a certain video
*/
function loadWaveform(cb) {
  var videoIndex = parseInt($(".video-selector").val(), 10);
  var wavesurfer = Object.create(WaveSurfer);
  var videoSrc = VIDEOS[videoIndex][2] || VIDEOS[videoIndex][1];
  var video = $(".main-video").get(0);

  $("#waveform").empty();
  $(".waveform-outer").css("width", (video.duration * 64) + "px");

  var options = {
    container     : document.querySelector('#waveform'),
    waveColor     : '#5195CE',
    progressColor : '#005DB3',
    loaderColor   : '#005DB3',
    cursorColor   : 'silver',
    pixelRatio    : 1,
    minPxPerSec   : 5,
    height        : 25,
    audioRate     : parseFloat($(".playback-selector").val()),
    normalize     : true,
  };
  wavesurfer.init(options);
  wavesurfer.setVolume(0);
  wavesurfer.load(videoSrc);

  wavesurfer.on('ready', function () {
    wavesurfer.skip(video.currentTime);
    var scrollLeft = video.currentTime * 64 - 200;
    $(".transcription-track, .final-transcription-track, .waveform-container").animate({scrollLeft: scrollLeft}, 500);
    $(".waveform-loading").addClass("hidden");
    disableMacBack($("canvas").toArray());
    $("canvas").mousewheel(function(e) {
      var deltaX = e.originalEvent.wheelDeltaX * -1;
      var deltaY = e.originalEvent.wheelDeltaY;
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        $(".waveform-container").get(0).scrollLeft -= (deltaY);
        e.preventDefault();
      }
    });
  });

  wavesurfer.on('play', function () {
    surferPlaying = true;
  });

  wavesurfer.on('pause', function () {
    surferPlaying = false;
  });

  wavesurfer.drawer.on('click', function (e, position) {
    var previousTime = wavesurfer.getCurrentTime();
    var wavesurferTime = position * video.duration;
    video.currentTime = wavesurferTime;
    $(".transcription-input-main").focus();
    incrementMetricCount("videoSeek", {time: wavesurferTime - previousTime});
  });

  globalSurfer = wavesurfer;
  cb();
}

/*
  Converts transcriptions to caption format
*/
function transcriptionsToCaptions(transcriptions) {
  return transcriptions.map(function (transcription) {
    var startTime = timeStringToNum(transcription.start);
    var endTime = timeStringToNum(transcription.end);
    var width = Math.max(endTime - startTime, 1) * 64;
    return {
      text: transcription.text,
      width: width
    };
  });
}

/*
  Converts a time string to a time integer
*/
function timeStringToNum(timeString) {
  var minutes = parseInt(timeString.split(":")[0], 10);
  var seconds = parseInt(timeString.split(":")[1], 10);
  return 60 * minutes + seconds;
}

/*
  Converts a time string to a time integer
*/
function incrementMetricCount(name, data) {
  metrics[name] = (metrics[name] || {});
  metrics[name].count = (metrics[name].count || 0) + 1;
  if (data) {
    metrics[name].data = (metrics[name].data || []).concat(data);
  }
}

/*
  Calculate total trancsription time
*/
function calculateTotalTime() {
  if (!metrics["totalTime"] && startTime) {
    metrics["totalTime"] = (new Date()).getTime() - startTime.getTime();
  }
}

/*
  Save the transcriptions
*/
function save() {
  var captions = transcriptionsToCaptions(transcriptions);
  console.log(JSON.stringify(captions));
  return JSON.stringify(captions);
}

/*
  Save the metrics
*/
function stats() {
  var videoIndex = parseInt($(".video-selector").val(), 10);
  metrics["video"] = VIDEOS[videoIndex][0];
  calculateTotalTime();
  console.log(JSON.stringify(metrics));
  return JSON.stringify(metrics);
}
