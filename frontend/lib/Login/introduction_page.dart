import 'package:flutter/material.dart';
import 'package:frontend/Login/register_page.dart';
import 'components/SlideFour.dart';
import 'components/SlideOne.dart';
import 'components/SlideThree.dart';
import 'components/SlideTwo.dart';

class PgIntroductionAnimationScreen extends StatefulWidget {
  const PgIntroductionAnimationScreen({super.key});

  @override
  _PgIntroductionAnimationScreenState createState() =>
      _PgIntroductionAnimationScreenState();
}

class _PgIntroductionAnimationScreenState
    extends State<PgIntroductionAnimationScreen>
    with SingleTickerProviderStateMixin {
  final PageController _pageController = PageController();
  int _currentIndex = 0;

  final List<Widget> _slides = [
    SlideOne(),
    SlideTwo(),
    SlideThree(),
    SlideFour(),
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _onSkipClick() {
    _pageController.animateToPage(
      _slides.length - 1,
      duration: const Duration(milliseconds: 500),
      curve: Curves.easeInOut,
    );
  }

  void _onBackClick() {
    if (_currentIndex > 0) {
      _pageController.previousPage(
        duration: const Duration(milliseconds: 500),
        curve: Curves.easeInOut,
      );
    }
  }

  void _onNextClick() {
    if (_currentIndex < _slides.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 500),
        curve: Curves.easeInOut,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          PageView(
            controller: _pageController,
            onPageChanged: (index) {
              setState(() {
                _currentIndex = index;
              });
            },
            children: _slides,
          ),
          Positioned(
            top: MediaQuery.of(context).padding.top,
            left: 16,
            child: _currentIndex > 0
                ? IconButton(
                    onPressed: _onBackClick,
                    icon: const Icon(Icons.arrow_back_ios_new_rounded),
                  )
                : const SizedBox(),
          ),
          Positioned(
            top: MediaQuery.of(context).padding.top,
            right: 16,
            child: TextButton(
              onPressed: _onSkipClick,
              child: const Text(
                'Skip',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
          ),
          Positioned(
            bottom: 60,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                _slides.length,
                (index) => AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  margin: const EdgeInsets.symmetric(horizontal: 5),
                  height: 10,
                  width: _currentIndex == index ? 15 : 10,
                  decoration: BoxDecoration(
                    color: _currentIndex == index
                        ? const Color.fromARGB(255, 15, 65, 107)
                        : Colors.grey,
                    borderRadius: BorderRadius.circular(5),
                  ),
                ),
              ),
            ),
          ),
          if (_currentIndex == _slides.length - 1)
            Positioned(
              bottom: 40,
              left: 20,
              right: 20,
              child: FloatingActionButton.extended(
                backgroundColor: const Color.fromARGB(255, 15, 65, 107),
                onPressed: () {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(
                        builder: (context) =>
                            RegistrationPage()), // Replace with your actual register page widget
                  );
                },
                label: const Text(
                  "Get Started",
                  style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Color.fromARGB(255, 227, 204, 204)),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
