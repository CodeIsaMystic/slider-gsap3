function init() {
  /**
   * Variables
   */
  let $projects = '.projects', // projects container
    $project = document.querySelectorAll('.project'), // individual projects
    $projectImageBefore = CSSRulePlugin.getRule('.project-image:before'), //  decoration
    $projectImageAfter = CSSRulePlugin.getRule('.project-image:after'), // decoration too
    tlProjects,
    tlProject,
    tlProjectLoader;

  //  Main projects Timeline
  tlProjects = gsap.timeline({ repeat: -1 });
  tlProjects.set($projects, {
    autoAlpha: 1,
  });

  $project.forEach(function (element, index) {
    tlProject = gsap.timeline();

    let projectClasses = element.className.split(' '),
      projectClass = projectClasses[1],
      $pixel = element.querySelectorAll('.pixel'),
      $pixels = element.querySelector('.project-pixels'),
      $projectTitle = element.querySelector('.project-title'),
      $projectSubtitle = element.querySelector('.project-subtitle'),
      $projectImage = element.querySelector('.project-image');

    /**
     * Project circles
     *     => Moving circles around project image - older IEs might struggle
     */
    let tlCircles = gsap.timeline({
      repeat: -1,
    });

    tlCircles
      .to($projectImageBefore, 0.8, {
        cssRule: {
          top: '5px',
        },
        ease: Linear.easeNone,
      })
      .to($projectImageBefore, 0.8, {
        cssRule: {
          left: '5px',
        },
        ease: Linear.easeNone,
      })
      .to($projectImageBefore, 0.8, {
        cssRule: {
          top: '-5px',
        },
        ease: Linear.easeNone,
      })
      .to($projectImageBefore, 0.8, {
        cssRule: {
          left: '-5px',
        },
        ease: Linear.easeNone,
      })
      .to(
        $projectImageAfter,
        0.7,
        {
          cssRule: {
            bottom: '6px',
          },
          ease: Linear.easeNone,
        },
        '0'
      )
      .to(
        $projectImageAfter,
        0.7,
        {
          cssRule: {
            right: '6px',
          },
          ease: Linear.easeNone,
        },
        '0.7'
      )
      .to(
        $projectImageAfter,
        0.7,
        {
          cssRule: {
            bottom: '-6px',
          },
          ease: Linear.easeNone,
        },
        '1.1'
      )
      .to(
        $projectImageAfter,
        0.7,
        {
          cssRule: {
            right: '-6px',
          },
          ease: Linear.easeNone,
        },
        '1.5'
      );

    /**
     * Project CTA
     */
    let tlProjectsCTA = gsap.timeline(),
      $projectLink = element.querySelector('.button-container'),
      $projectLinkButton = element.querySelector('.button'),
      $projectLinkSpan = element.querySelectorAll('.bp'),
      $projectLinkText = element.querySelector('.bp-text');

    tlProjectsCTA
      .to($projectSubtitle, 0.3, {
        autoAlpha: 0,
        yPercent: 100,
        ease: Back.easeOut,
      })
      .staggerFrom(
        $projectLinkSpan,
        0.3,
        {
          autoAlpha: 0,
          yPercent: '-100',
          ease: Back.easeOut,
        },
        0.1
      )
      .from(
        $projectLinkText,
        0.3,
        {
          autoAlpha: 0,
          x: '-100%',
          ease: Power4.easeInOut,
        },
        '-=0.2'
      );

    /**
     * Project Loader
     */
    (tlProjectLoader = gsap.timeline({
      paused: true,
    })),
      ($loader = element.querySelectorAll('.loader'));

    if (projectClass !== 'project00') {
      tlProjectLoader
        .to([$projectImageBefore, $projectImageAfter], 0.4, {
          cssRule: {
            opacity: '0',
          },
        })
        .fromTo(
          $loader,
          5,
          {
            strokeDasharray: 547,
            strokeDashoffset: 547,
          },
          {
            strokeDasharray: 547,
            strokeDashoffset: 0,
            ease: Power0.easeNone,
          }
        )
        .to($loader, 0.4, {
          autoAlpha: 0,
          onComplete: resumeProjects,
        })
        .to(
          [$projectImageBefore, $projectImageAfter],
          0.4,
          {
            cssRule: {
              opacity: '1',
            },
          },
          '-=0.4'
        );
    }

    /**
     * Creating the project Timeline
     */
    tlProject
      .set(element, {
        zIndex: 1,
      })
      .set([$projectTitle, $projectSubtitle, $pixel], {
        autoAlpha: 0,
      })
      .fromTo(
        $projectImage,
        0.4,
        {
          autoAlpha: 0,
          xPercent: '-200',
        },
        {
          autoAlpha: 1,
          xPercent: '-10',
          ease: Power4.easeInOut,
          onStart: updateClass,
          onStartParams: [projectClass],
        }
      ) // calling the updateClass function & params
      .add('imageIn')
      .staggerFromTo(
        $pixel,
        0.3,
        {
          autoAlpha: 0,
          x: '-=10',
        },
        {
          autoAlpha: 1,
          x: '0',
          ease: Power4.easeInOut,
        },
        0.02,
        '-=0.2'
      )
      .add('pixelsIn')
      .fromTo(
        $projectTitle,
        0.7,
        {
          autoAlpha: 0,
          xPercent: '-50',
        },
        {
          autoAlpha: 1,
          xPercent: '-5',
          ease: Power4.easeInOut,
        },
        '-=0.4'
      )
      .fromTo(
        $projectSubtitle,
        0.7,
        {
          autoAlpha: 0,
          xPercent: '-50',
        },
        {
          autoAlpha: 1,
          xPercent: '-2',
          ease: Power4.easeInOut,
        },
        '-=0.5'
      )
      .add('titleIn')
      .add(tlProjectsCTA, '+=2') // add btn animation to the project Timeline
      .to(
        $projectTitle,
        4.3,
        {
          xPercent: '+=5',
          ease: Linear.easeNone,
        },
        'titleIn-=0.1'
      )
      .to(
        $projectSubtitle,
        4.3,
        {
          xPercent: '+=2',
          ease: Linear.easeNone,
        },
        'titleIn-=0.2'
      )
      .add('titleOut')
      .to(
        $projectImage,
        5,
        {
          xPercent: '0',
          ease: Linear.easeNone,
          onComplete: pauseProjects,
          onCompleteParams: [projectClass, tlProjectLoader],
        },
        'imageIn'
      )
      .add('imageOut')
      .to(
        $pixels,
        4.1,
        {
          x: '-5',
          ease: Linear.easeNone,
        },
        'pixelsIn'
      )
      .to(
        [$projectTitle, $projectSubtitle, $projectLink],
        0.5,
        {
          autoAlpha: 0,
          xPercent: '+=10',
          ease: Power4.easeInOut,
        },
        'titleOut'
      )
      .to(
        $projectImage,
        0.4,
        {
          autoAlpha: 0,
          xPercent: '+=80',
          ease: Power4.easeInOut,
        },
        'imageOut'
      );

    //  Add project to the project timeline
    tlProjects.add(tlProject);
  });

  //  Create a function to Update the Body Class
  function updateClass(projectClass) {
    document.querySelector('body').className = projectClass;
  }

  //  Create a function to pause the slider after the project00
  function pauseProjects(projectClass, tlProjectLoader) {
    tlProjects.pause();

    if (projectClass != 'project00') {
      tlProjectLoader.seek(0);
      tlProjectLoader.play();
    }
  }

  //  Resume the project timeline => jump to a specific time
  document
    .querySelector('.project00 .button')
    .addEventListener('click', function (e) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }

      tlProjects.resume();
    });

  //  Create the resumeProjects function
  function resumeProjects() {
    tlProjects.resume();
  }
}

window.addEventListener('load', function () {
  init();
});
