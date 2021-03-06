/**
 * Created by kevin on 2014-09-08.
 */

define(function (require) {

  var $ = require('jquery');
  var uuid = require('util/uuid');

  require('jquery_extensions');

  function add (node, term) {
    term = $(term).clone().get(0);
    $(term).attr('id', uuid());

    if ($(node).is('mrow')) {
      if ($(node).hasAddOps()) {
        $(node).prepend(term.outerHTML + '<mo class="op" id="' + uuid() + '">+</mo>');
      } else if ($(node).hasMulOps()) {
        $(node).wrap('<mrow></mrow>').before(term.outerHTML + '<mo class="op" id="' + uuid() + '">+</mo>');
      } else if ($(node).hasEqualSign()) {
        add(node.firstElementChild, term);
        add(node.lastElementChild, term);
      } else {
        throw 'can\'t add';
      }
    } else if ($(node).is('mn') || $(node).is('mi')) {
      $(node).wrap('<mrow></mrow>').before(term.outerHTML + '<mo class="op" id="' + uuid() + '">+</mo>');
    } else {
      throw 'can\'t add';
    }
  }

  function subtract (node, term) {
    term = $(term).clone().get(0);
    $(term).attr('id', uuid());

    if ($(node).is('mrow')) {
      if ($(node).hasAddOps()) {
        $(node).append('<mo class="op" id="' + uuid() + '">-</mo>' + term.outerHTML);
      } else if ($(node).hasMulOps()) {
        $(node).wrap('<mrow></mrow>').after('<mo class="op" id="' + uuid() + '">-</mo>' + term.outerHTML);
      } else if ($(node).hasEqualSign()) {
        subtract(node.firstElementChild, term);
        subtract(node.lastElementChild, term);
      } else {
        throw 'can\'t subtract';
      }
    } else if ($(node).is('mn') || $(node).is('mi')) {
      $(node).wrap('<mrow></mrow>').after('<mo class="op" id="' + uuid() + '">-</mo>' + term.outerHTML);
    } else {
      throw 'can\'t subtract';
    }
  }

  function multiply(node, term) {
    term = $(term).clone().get(0);
    $(term).attr('id', uuid());

    if ($(node).is('mrow')) {
      if ($(node).hasAddOps()) {
        $(node).wrap('<mrow></mrow>').before(term.outerHTML + '<mo class="op" id="' + uuid() + '">*</mo>');
      } else if ($(node).hasMulOps()) {
        if ($(node).isFraction()) {
          if ($(node).parent().hasAddOps()) {
            var mrow = $('<mrow></mrow>').attr('id', uuid());
            $(node).replaceWith(mrow);
            mrow.append(term.outerHTML)
              .append($('<mo>*</mo>').attr('id', uuid()).addClass('op'))
              .append(node);
          } else {
            $(node).before(term.outerHTML + '<mo class="op" id="' + uuid() + '">*</mo>');
          }
        } else {
          $(node).prepend(term.outerHTML + '<mo class="op" id="' + uuid() + '">*</mo>');
        }
      } else if ($(node).hasEqualSign()) {
        multiply(node.firstElementChild, term);
        multiply(node.lastElementChild, term);
      } else {
        throw 'can\'t multiply';
      }
    } else if ($(node).is('mn') || $(node).is('mi')) {
      $(node).wrap('<mrow></mrow>').before(term.outerHTML + '<mo class="op" id="' + uuid() + '">*</mo>');
    } else {
      throw 'can\'t multiply';
    }
  }

  function divide (node, term) {
    term = $(term).clone().get(0);
    $(term).attr('id', uuid());

    if ($(node).is('mrow')) {
      if ($(node).hasAddOps()) {
        $(node).wrap('<mrow></mrow>').after('<mo class="op" id="' + uuid() + '">/</mo>' + term.outerHTML);
      } else if ($(node).hasMulOps()) {
        $(node).append('<mo class="op" id="' + uuid() + '">/</mo>' + term.outerHTML);
      } else if ($(node).hasEqualSign()) {
        divide(node.firstElementChild, term);
        divide(node.lastElementChild, term);
      } else {
        throw 'can\'t divide';
      }
    } else if ($(node).is('mn') || $(node).is('mi')) {
      $(node).wrap('<mrow></mrow>').after('<mo class="op" id="' + uuid() + '">/</mo>' + term.outerHTML);
    } else {
      throw 'can\'t divide';
    }
  }

  return function (node, operator, expr) {
    if (/[\+\-\/\*\^]/.test(operator)) {
      switch (operator) {
        case '+':
          add(node, expr);
          break;
        case '-':
          subtract(node, expr);
          break;
        case '*':
          multiply(node, expr);
          break;
        case '/':
          divide(node, expr);
          break;
        default:
          throw 'we don\'t handle that operator yet, try again later';
      }
    }
  };
});
