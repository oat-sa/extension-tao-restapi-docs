<?php
/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2016  (original work) Open Assessment Technologies SA;
 * 
 * @author Alexander Zagovorichev <zagovorichev@1pt.com>
 */

namespace oat\taoRestApiDocs\model\proxy\format;


use oat\taoRestApiDocs\model\proxy\DocsProxyInterface;


class Swagger2_0 implements DocsProxyInterface
{

    private $requiredStructure = [
        "swagger" => "2.0",
        "info" => [
            'title' => true,
            'version' => true
        ],
        "basePath" => true,
        "paths" => true,
        "tags" => true
    ];

    public function valid(\stdClass $swagger)
    {
        return $this->check($this->requiredStructure, $swagger);
    }

    private function check(array $structure, \stdClass $object)
    {
        foreach ($structure as $key => $value) {
            if (!isset($object->$key)) {
                \common_Logger::w('Property "' . $key . '" not found in the Swagger2.0 required structure');
                return false;
            }

            if (is_array($value)) {
                if ($object->$key instanceof \stdClass) {
                    return self::check($value, $object->$key);
                }else{
                    return false;
                }
            }elseif (is_string($value) && !empty($value) && $object->$key !== $value) {
                \common_Logger::w('In property "' . $key . '" for Swagger2.0 required structure should be value "'. $value .'"');
                return false;
            }
        }
        return true;
    }
    
    public function append(\stdClass $docs, \stdClass $part)
    {
        
        // description
        $title = $part->info->title .' '. $part->info->version;
        $docs->info->description .= "\n\n## " . $title;
        if(isset($part->info->description)) {
            $docs->info->description .= "\n\n" . $part->info->description;
        }
        
        if (isset($part->externalDocs)) {
            $docs->info->description .= "\n\n[".$part->externalDocs->description."](".$part->externalDocs->url.")";
        }

        if (isset($part->securityDefinitions)) {
            $docs->securityDefinitions =
                isset($docs->securityDefinitions)
                    ? (object) array_merge((array) $docs->securityDefinitions, (array) $part->securityDefinitions)
                    : $part->securityDefinitions;
        }

        if (isset($part->definitions)) {
            $docs->definitions =
                isset($docs->definitions)
                    ? (object) array_merge((array) $docs->definitions, (array) $part->definitions)
                    : $part->definitions;
        }

        // add extension tag to all part paths
        $extensionTag = ['name' => $title, 'description' => 'Extension ' . $part->info->title];
        $partTags = [];
        foreach ($part->paths as $path => $body) {
            foreach ($body as $param => $obj) {
                
                $hasTag = false;
                if (isset($obj->tags)) {
                    foreach ($obj->tags as $tag) {
                        
                        if ( (is_object($tag) && $tag->name == $extensionTag['name'])
                            || $tag == $extensionTag['name']) {
                            $hasTag = true;
                            break;
                        } else {
                            $partTags[] = is_object($tag) ? '**' . $tag->name . '**' . ($tag->description ? ': ' . $tag->description : '') : $tag; 
                        }
                    }
                } 
                
                if (!$hasTag) {
                    $part->paths->$path->$param->tags = [$extensionTag['name']];
                }
            }
        }
        
        $tagDesc = [];
        foreach ($part->tags as $tag) {
            $tagDesc[$tag->name] = $tag->description;
        }
        
        // write all part tags into the documentation
        if(count($partTags)) {
            $partTags = array_unique($partTags);
            array_walk($partTags, function (&$val) use ($tagDesc) {
                if (isset($tagDesc[$val])) {
                    $val = $tagDesc[$val];
                }
            });
            $docs->info->description .= "\n\n####Operations:\n\n" . implode("\n   -", $partTags);
        }
        
        $docs->paths =
            isset($docs->paths)
                ? (object) array_merge((array) $docs->paths, (array) $part->paths)
                : $part->paths;

        $docs->tags = array_merge((array) $docs->tags, [$extensionTag]);

        return $docs;
    }
    
}
