import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class widTextLabel extends StatelessWidget {
  final String? text;
  final double? fontSize;
  final Color? color;
  final FontWeight? fontWeight;
  final double? latterSpacing;
  final TextOverflow? textOverflow;
  final int? maxLines;
  final TextAlign? textAlign;
  final double? height;
  final double? wordSpacing;
  final TextDecoration? textDecoration;
  final FontStyle? fontStyle;
  const widTextLabel({
    super.key,
    this.text,
    this.fontSize,
    this.color,
    this.textOverflow,
    this.fontWeight,
    this.latterSpacing,
    this.maxLines,
    this.textAlign,
    this.height,
    this.wordSpacing,
    this.textDecoration,
    this.fontStyle,
  });

  @override
  Widget build(BuildContext context) {
    return Text(
      text!,
      style: GoogleFonts.poppins(
        fontSize: fontSize,
        color: color,
        fontWeight: fontWeight,
        letterSpacing: latterSpacing,
        height: height,
        wordSpacing: wordSpacing,
        decoration: textDecoration,
        fontStyle: fontStyle,
      ),
      maxLines: maxLines,
      overflow: textOverflow,
      textAlign: textAlign,
    );
  }
}
