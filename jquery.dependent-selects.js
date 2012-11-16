// Generated by CoffeeScript 1.4.0
/*
# jQuery Dependent Selects v1.0.2
# Copyright 2012 Mark J Smith, Simpleweb
# Details on http://github.com/simpleweb/jquery-dependent-selects
*/

(function($) {
  return $.fn.dependentSelects = function(options) {
    var clearAllSelectsByParent, createNewSelect, createSelectId, findSelectParent, prepareSelect, selectChange, selectPreSelected, selectedOption, splitOptionName;
    if (options == null) {
      options = {};
    }
    options = $.extend({
      'separator': ' > ',
      'placeholder': '',
      'class': false
    }, options);
    createSelectId = function() {
      var int;
      int = parseInt(Math.random() * 1000);
      if ($("[data-dependent-id='" + int + "']").length > 0) {
        return createSelectId();
      } else {
        return int;
      }
    };
    splitOptionName = function($option) {
      var array, i, item, _i, _len;
      array = $option.text().split(options.separator).map(function(valuePart) {
        return valuePart.trim();
      });
      i = 0;
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        item = array[_i];
        if (item === '') {
          array.splice(i, 1);
          i--;
        }
        i++;
      }
      return array;
    };
    clearAllSelectsByParent = function($parent) {
      return $(".dependent-sub[data-dependent-id='" + ($parent.attr('data-dependent-id')) + "']").each(function() {
        if (parseInt($(this).attr('data-dependent-depth')) > parseInt($parent.attr('data-dependent-depth'))) {
          $(this).find('option:first').attr('selected', 'selected');
          return $(this).hide();
        }
      });
    };
    createNewSelect = function(options) {
      var $currentSelect, $newSelect, $select, name, select_id;
      if (options == null) {
        options = {};
      }
      name = options.name;
      $select = options.select;
      select_id = $select.attr('data-dependent-id');
      if (($currentSelect = $("select[data-dependent-parent='" + name + "'][data-dependent-id='" + select_id + "']")).length > 0) {
        return $currentSelect;
      }
      $newSelect = $('<select class="dependent-sub"/>').attr('data-dependent-parent', name).attr('data-dependent-depth', options.depth).attr('data-dependent-input-name', $select.attr('data-dependent-input-name')).attr('data-dependent-id', select_id).addClass(options["class"]).append("<option>" + options.placeholder + "</option>");
      $newSelect.insertAfter($select);
      return $newSelect.hide();
    };
    selectChange = function($select) {
      var $sub, select_id, val, valName;
      $("select[data-dependent-id='" + ($select.attr('data-dependent-id')) + "'][name]").removeAttr('name');
      valName = $select.find(':selected').html();
      val = $select.val();
      select_id = $select.attr('data-dependent-id');
      clearAllSelectsByParent($select);
      if (($sub = $(".dependent-sub[data-dependent-parent='" + valName + "'][data-dependent-id='" + select_id + "']")).length > 0) {
        $sub.show();
        return $sub.attr('name', $select.attr('data-dependent-input-name'));
      } else {
        return $select.attr('name', $select.attr('data-dependent-input-name'));
      }
    };
    selectedOption = function($select) {
      var $selectedOption, val;
      $selectedOption = $select.find('option:selected');
      val = $selectedOption.val();
      if (!(val === '' || val === options.placeholder)) {
        return $select.attr('data-dependent-selected-id', val);
      }
    };
    findSelectParent = function($select) {
      var $all_options, $selects;
      $selects = $("[data-dependent-id='" + ($select.attr('data-dependent-id')) + "']");
      $all_options = $selects.find('option');
      return $selects.filter(function() {
        var vals;
        vals = [];
        $(this).find('option').each(function() {
          return vals.push($(this).html() === $select.attr('data-dependent-parent'));
        });
        return $.inArray(true, vals) > -1;
      });
    };
    selectPreSelected = function($select) {
      var $all_options, $current_select, $selected_option, $selected_select, $selects, current_option_text, i, selected_id, _i, _ref;
      if ((selected_id = $select.attr('data-dependent-selected-id'))) {
        $selects = $("[data-dependent-id='" + ($select.attr('data-dependent-id')) + "']");
        $all_options = $selects.find('option');
        $selected_option = $all_options.filter("[value='" + selected_id + "']");
        $selected_select = $selected_option.closest('select');
        $current_select = $selected_select;
        current_option_text = $selected_option.html();
        for (i = _i = _ref = parseInt($selected_select.attr('data-dependent-depth')); _ref <= 0 ? _i <= 0 : _i >= 0; i = _ref <= 0 ? ++_i : --_i) {
          $current_select.find('option').each(function() {
            if ($(this).html() === current_option_text) {
              return $(this).attr('selected', 'selected');
            } else {
              return $(this).removeAttr('selected');
            }
          });
          $current_select.show();
          current_option_text = $current_select.attr('data-dependent-parent');
          $current_select = findSelectParent($current_select);
        }
        return $selected_select.trigger('change');
      }
    };
    prepareSelect = function($select, depth, select_id) {
      var $options, name;
      $select.attr('data-dependent-depth', depth).attr('data-dependent-id', select_id);
      $options = $select.children('option');
      $options.each(function() {
        var $newOption, $option, $subSelect, name, val;
        $option = $(this);
        name = splitOptionName($option);
        val = $option.val();
        if (name.length > 1) {
          $subSelect = createNewSelect({
            name: name[0],
            select: $select,
            depth: depth + 1,
            placeholder: options.placeholder,
            "class": options["class"]
          });
          $newOption = $option.clone();
          $newOption.html(splitOptionName($newOption).slice(1).join(options.separator).trim());
          $subSelect.append($newOption);
          $option.val('').html(name[0]).attr('data-dependent-name', name[0]);
          if ($options.parent().find("[data-dependent-name='" + name[0] + "']").length > 1) {
            $option.remove();
          }
          return prepareSelect($subSelect, depth + 1, select_id);
        }
      });
      name = $select.attr('name');
      selectChange($select);
      return $select.off('change').on('change', function() {
        return selectChange($select);
      });
    };
    return this.each(function() {
      var $select;
      $select = $(this);
      $select.attr('data-dependent-input-name', $select.attr('name'));
      selectedOption($select);
      prepareSelect($select, 0, createSelectId());
      return selectPreSelected($select);
    });
  };
})(jQuery);
